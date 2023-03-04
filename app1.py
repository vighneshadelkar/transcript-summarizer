from flask import Flask, request
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline, T5ForConditionalGeneration, T5Tokenizer

# Define a variable to hold you app
app = Flask(__name__)

# Define your resource endpoints
@app.route("/summary")
def summary_api():
    url = request.args.get('url', '')
    # url = request.args.get('https://www.youtube.com/watch?v=8HslUzw35mc', '')
    video_id = url.split('=')[1]
    summary = get_summary(get_transcript(video_id))
    # summary = get_summary(get_transcript('Yldkh0aOEcg'))
    return summary, 200
    # return render_template('test.html', summary=summary)


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


def get_summary(transcript):
    model = T5ForConditionalGeneration.from_pretrained("t5-base")
    tokenizer = T5Tokenizer.from_pretrained("t5-base")

    summary = ''
    # encode the text into tensor of integers using the appropriate tokenizer
    for i in range(len(transcript)//1000+1):
        inputs = tokenizer.encode("summarize: " + transcript[i*1000:(i+1)*1000], return_tensors="pt")

        outputs = model.generate(
            inputs, 
            max_length=150, 
            min_length=40, 
            length_penalty=2.0, 
            num_beams=4, 
            early_stopping=True)
        
        summary += tokenizer.decode(outputs[0], skip_special_tokens=True)
        # summary += tokenizer.decode(outputs[0], skip_special_tokens=True, clean_up_tokenization_spaces=True)

    print('Transcript:', transcript)
    print('Summary: ', summary)
    return summary


# Server the app when this file is run
if __name__ == '__main__':
    app.run(debug=True)