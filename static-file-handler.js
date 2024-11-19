import http from 'http';
import fs from 'fs/promises'

/**
 * 
 * @param {string[]} pathSegments 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */

//En funktion, exporterar från index.js, hanterar också 3 parametrar
export async function handlestaticFileRequest(pathSegments, request, response){
    let fileName = pathSegments[pathSegments.length - 1];
    let dotIndex = fileName.lastIndexOf('.');


//Kollar om dotIndex (filnamnets sista index) = -1.
//Om villkoret uppfylls så får klienten ett 400 fel (servern anser att klienten gjort fel)
//Då skrivs 400 bad request ut och avslutar svaret
    if(dotIndex === -1){
        response.writeHead(400, { 'Content-Type': 'text/plain' });
        response.write('400 Bad Request');
        response.end();
    }

    let ext = fileName.substring(dotIndex + 1);
//Kollar om filändelsen (ext) är lika med villkoret. Om filändelsen stämmer överens med villkoret så sätts mimetypen till den filens mimetyp
//tex om ext = mp4 så sätts MimeType till video/mp4
//Om inget stämmer skcikas ett 500 fel (ett hinder för att kunna avsluta begäran)
    let mimeType;
    if (ext === 'ext') {
        mimeType = 'text/plain'
    } else if (ext === 'html'){
        mimeType = 'text/html'
    } else if (ext === 'css'){
        mimeType = 'text/css'
    }else if (ext === 'png'){
        mimeType = 'image/png'
    } else if (ext ==='JPG'|| ext === 'JPEG') {
        mimeType = 'image/jpeg'    
    } else if(ext === 'SVG'){
        mimeType = 'image/svg+xml'
    }  else if(ext === 'MP4'){
        mimeType = 'video/mp4'   
    } else {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.write('500 Internal Server Error');
        response.end();

    }

    pathSegments.shift();

    //kombinerar URLen med "/" och inte mellanslag
    let filePath = pathSegments.join('/');

    let fileContents;
//först försöker en fil att läsas in. Om filen inte finns skickas svaret 404 not found till klienten och avslutar svaret.
//Annars sker samma princip, om det sker ett serverfel (500) dvs att något stoppade begäran från att uppfylla
    try{
        fileContents = await fs.readFile('public/' + filePath);
    }catch (err){
        if (err.code === 'ENOENT'){
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write('404 Not Found');
            response.end();
            return;
        } else{
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.write('500 Internal Server Error');
            response.end();
            return;
        }
    }
    
//Om inget av dem stämmer så godtas förfrågan och önskade Mimetypen skickas och sedan avslutas svaret och skickas till klienten. 
    response.writeHead(200, { 'Content-Type': mimeType });
    response.write(fileContents);
    response.end();
    //index.html
}