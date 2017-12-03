const express = require('express');
const ffmpeg = require('ffmpeg');
const app = express();
const summary = require('node-summary');
const path    = require("path");
const youtubedl = require('youtube-dl');
const exphbs  = require('express-handlebars');
const config = require(__dirname+'/config');

console.log(config);

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


const fs = require('fs');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

app.get('/', (req,res)=>{

	res.render('index',{layout:false, success:'Request has been made'});
});

app.post('/getSummary', (req,res)=>{
	const youtube = youtubedl(req.body.url);
	youtube.on('info', (info) => console.log("Download started"));

	const download = youtube.pipe(fs.createWriteStream('./video/ytVideo.mp4'));

	download.on('finish',()=>{
	const video = new ffmpeg('./video/ytVideo.mp4');
	video.then((vid)=>{
		const metadata = vid.metadata;
		vid.fnExtractSoundToMP3('./audio/audio.mp3', ()=>{
			console.log('extracted', `${__dirname}/audio/audio.mp3`);
			const speech_to_text = new SpeechToTextV1({
			  username: '4910c1bc-12c2-40a7-99e4-38824182233e',
			  password: 'bhZkVCBgF4k1',
			});
			const params = {
			    audio: fs.createReadStream('./audio/audio.mp3'),
			    content_type: 'audio/mp3',
			    timestamps: true,
			    continuous: true,
			    smart_formatting:true,
			    model:'en-US_NarrowbandModel',
			};
			const recognizeStream = speech_to_text.createRecognizeStream(params);
			fs.createReadStream('./audio/audio.mp3').pipe(recognizeStream);
			//recognizeStream.pipe(fs.createWriteStream('transcription.txt'));
			const stream = fs.createWriteStream('transcription.txt');
			recognizeStream.on('data', (chunk)=>{
				stream.write(chunk.toString() + '. \n');			
			});
			recognizeStream.on('close', ()=>{
				const title = '';
				const text = 'transcription.txt';
				fs.readFile(text, (err,data)=>{
					if(err) throw err;
					const content = data.toString('utf-8');
						
				summary.summarize(title, content, function(err, summary) {
					if(err) console.log("Something went wrong man!");	
					console.log("Original Length " + (title.length + content.length));
				});		
				summary.summarize(title,content,(err,sum,dict)=>{
					console.log("Summary Length " + sum.length);
					console.log("Summary Ratio: " + (100 - (100 * (sum.length / (title.length + content.length)))));
					const length = content.split('.').length;
					console.log(length);
					const ratio = length/3;
					console.log(Math.floor(ratio));
						summary.getSortedSentences(content, ratio, (err, sorted_sentences)=>{
							const sorted = sorted_sentences.join(' ');
							console.log(sorted);
							res.json(sorted)
						}, dict);
					});
				});
			});
				});
			});
		});
	});

app.listen(3000,()=>{
	console.log("Listening on port 3000");
})