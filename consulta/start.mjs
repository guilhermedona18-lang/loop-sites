import next from 'next';
import {createServer} from 'node:http';
const port=Number(process.env.PORT||10000);const hostname='0.0.0.0';
const app=next({dev:false,hostname,port});await app.prepare();
const server=createServer(app.getRequestHandler());server.listen(port,hostname,()=>console.log('Listening on port '+port));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{server.close(()=>process.exit(0));setTimeout(()=>process.exit(0),25000).unref();});
