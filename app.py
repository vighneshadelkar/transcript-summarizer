from flask import Flask, request
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline

# Define a variable to hold you app
app = Flask(__name__)

'''
@app.route('/')
def index():
    return render_template('index.html')
'''

# Define your resource endpoints
@app.route("/summary")
def summary_api():
    url = request.args.get('url', '')
    video_id = url.split('=')[1]
    summary = get_summary(get_transcript(video_id))
    return summary


def get_transcript(video_id):
    # Returns a list of dictionaries
    #transcript_list = YouTubeTranscriptApi.get_transcript(video_id)

    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
    print(transcript_list)
    for transcript in transcript_list:
        if transcript.language_code == 'en':
            transi = transcript.fetch() 
            entranscript = ' '.join([d['text'] for d in transi])
            return entranscript

    for transcript in transcript_list:
        if transcript.is_translatable == True:
            transi = transcript.translate('en').fetch()
            entranscript = ' '.join([d['text'] for d in transi])
            return entranscript
        else:
            return "Subtitles unavailable"


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

    transcript = ' '.join([d['text'] for d in transi])
    
    return transcript


def get_summary(transcript):
    summarizer = pipeline('summarization')
    summary = ''
    for i in range(len(transcript)//1000+1):
        summary_text = summarizer(transcript[i*1000:(i+1)*1000])[0]['summary_text']
        summary += summary_text +  ' '
    print(transcript)
    return summary
    

# Server the app when this file is run
if __name__ == '__main__':
    app.run(debug=True)