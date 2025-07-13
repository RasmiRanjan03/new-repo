from flask import Flask,request,redirect,render_template,jsonify
import os, json

app=Flask(__name__)
FILES_FOLDER = os.path.join(app.static_folder, 'songs')

@app.route('/')
def hello():
    
    return render_template('index.html')
@app.route('/playlist',methods=['GET','POST'])
def getplaylist():
    playlists=[]
    for playlist in os.listdir(FILES_FOLDER):
        playlists.append(playlist)
    return jsonify({'song':playlists})
@app.route('/songs/<foldername>',methods=['GET','POST'])
def getsong(foldername):
    playlists=[]
    for playlist in os.listdir(FILES_FOLDER):
        playlists.append(playlist)
    if foldername in playlists:
        file=os.path.join(FILES_FOLDER, foldername)
        with open(os.path.join(file, 'info.json'), 'r',encoding='utf-8') as f:
            info = json.load(f)
        return jsonify(info)
@app.route('/fetchspotify/<folder>',methods=['GET','POST'])
def fetchspotify(folder):
    playlist=[]
    file=os.path.join(FILES_FOLDER, folder)
    for song in os.listdir(file):
        playlist.append(song)
    return jsonify({'song':playlist})
@app.route('/fetchimage/<folder>',methods=['GET','POST'])
def imagefind(folder):
    folder='search.svg'
    file=os.path.join(app.static_folder, 'image')
    print(os.path.join(file, folder))
if __name__ == '__main__':
    app.run(debug=True)