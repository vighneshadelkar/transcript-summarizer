from flask import Flask, request, render_template
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline
from flask_mail import Mail, Message
import os


# Define a variable to hold you app
app = Flask(__name__)

if not os.environ.get("Pass"):
    raise RuntimeError("Password required")

# configuration of mail
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'goushala1@gmail.com'
app.config['MAIL_PASSWORD'] = os.environ['Pass']
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

    #summary = get_summary('''
    #    Hello man.
    #''')
    return summary


@app.route("/mail", methods=["POST"])
def mailme():
    print("I truly came here")
    summ = request.get_json()
    vid = summ['id']
    email_id = str(summ['mail_id'])
    print(email_id)
    summary = summ['body']
    msg = Message(
                f'Summary script generated for video id: {vid}',
                sender ='YTS',
                recipients = [email_id]
                )
    msg.html = render_template('mail.html', summary=summary)

    mail.send(msg)
    return "Done", 200


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
    mxlen = int(100)
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