### Too-Long-I-ll-Read

## Inspiration

I was trying to come up with an idea for this hackathon and had a friend of mine from UM help me brainstorm ideas. Are brainstorming went nowhere and she mentioned that she had to watch a two-hour documentary for a class. Remembering all the times that I had to watch online videos that were uneventful, slow and didn't get to the point. The idea occurred to me why watch a video that at times has pointless talking points for the sake of extending the video when I can just summarize the video into a quick, brief yet coherent text summary. 

## What it does
The website takes any youtube link as input, downloads the youtube video to an mp4 file and obtains an mp3 file from the video. Using IBM Watson's speech to text functionality, the program writes the text to a text file using nodejs streams, which is then later summarized using a nodejs library that utilizes an algorithm to return text that contains the most important sentences of the text. Of which is returned to the users end on the website. 

## How I built it

I built the backend on nodejs, using the express module. The view is in html, css, javascript, using jquery. 
The express server manages the connection to the IBM watson API, as well as the download, mp3 parse and speech to text functions of the project. 

## Challenges I ran into

The first issue I ran into was finding a decent speech to text api, countless apis had anti-beginner methods of authenticating credentials. It wasn't until I spoke with the iBM table that I had realized that IBM Watson was an option, fortunately, the authentication process with IBM watson was very simple. 

The second issue I ran into was the lack of punctuation from IBM Watson. I solved this by adding a period everytime there is a pause in the audio. 

## Accomplishments that I'm proud of

Successfully using the IBM watson speech to text service. As well creating this project without a team and on my own(Although, I owe an immense amount of gratitude to the mentors who aided me along this project).

## What I learned

I reinforced my skills in node js as well as learning how to use services such as IBM watson. 

## What's next for Too Long, I'll Read

For this project in particular I want to optimize the summary algorithm provided by the library and make the best summary based on the length of the video. I also want to find a way to summarize the video aspect of the youtube video. As well as a design overhaul on the front end. 
