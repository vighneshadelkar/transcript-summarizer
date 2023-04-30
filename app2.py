from flask import Flask, request, render_template
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline
from flask_mail import Mail, Message


# Define a variable to hold you app
app = Flask(__name__)

# configuration of mail
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'goushala1@gmail.com'
app.config['MAIL_PASSWORD'] = 'tlhfyjtpdkoaedtl'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)


'''
@app.route('/')
def index():
    return render_template('index.html')
'''

# Define your resource endpoints
@app.route("/summary")
def summary_api():
    url = request.args.get('url', '')
    print(url)
    temp = url.split('=')[1]
    print(temp)
    video_id, penalty = temp.split('$')
    summary = get_summary(get_transcript(video_id), penalty)

    msg = Message(
                f'Summary script generated for video id: {url}',
                sender ='YTS',
                recipients = ['barwasomya@gmail.com']
                )
    msg.html = render_template('mail.html', summary=summary)

    mail.send(msg)

    #summary = get_summary('''
    #    Hello man.
    #''')
    return summary


def get_transcript(video_id):
    # Returns a list of dictionaries
    transcript_list = YouTubeTranscriptApi.get_transcript(video_id)

    # Dictionary format
    '''
        [
            {
                'text': 'Hey there',
                'start': 7.58,
                'duration': 6.13
            },
            {
                'text': 'how are you',
                'start': 14.08,
                'duration': 7.58
            },
            # ...
        ]
    '''

    transcript = ' '.join([d['text'] for d in transcript_list])
    
    return transcript


def get_summary(transcript,penalty):
    pen=int(1)
    pen+=(int(penalty)-5)/10
    mxlen = int(110)
    mxlen+=(int(penalty)-5)*15
    print(pen)
    print(mxlen)
    summarizer = pipeline('summarization')
    summary = ''
    for i in range(len(transcript)//1000+1):
        summary_text = summarizer(transcript[i*1000:(i+1)*1000], min_length=20, max_length= mxlen, length_penalty=pen)[0]['summary_text']
        summary += summary_text +  ' '
    print(transcript)
    print(summary)
    return summary
    

# Server the app when this file is run
if __name__ == '__main__':
    app.run(debug=True)