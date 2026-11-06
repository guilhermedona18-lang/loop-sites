"""Read-only deployment checks. Provide credentials as one JSON line on stdin."""
import json,sys,urllib.request,urllib.error,urllib.parse
cfg=json.loads(sys.stdin.readline())
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args,**kwargs):return None
opener=urllib.request.build_opener(NoRedirect)
def req(url,data=None,headers=None):
 try:
  r=opener.open(urllib.request.Request(url,data=data,headers=headers or {}),timeout=120)
  body=r.read();print(urllib.parse.urlparse(url).path,r.status,flush=True);return r.status,r.headers,body
 except urllib.error.HTTPError as e:
  body=e.read();print(urllib.parse.urlparse(url).path,e.code,flush=True);return e.code,e.headers,body
origin=cfg['catalog'].rstrip('/');portal=cfg['portal'].rstrip('/')
s,h,b=req(origin+'/api/health');assert s==200,'catalog health: '+str(s)
s,h,b=req(portal+'/api/health');assert s==200,'portal health: '+str(s)
s,h,b=req(origin+'/dash');assert s in [303,307,308] and '/dash/login' in h.get('Location',''),'anonymous dashboard blocked: '+str(s)
s,h,b=req(origin+'/api/contracts/999999999');assert s==401,'anonymous contract blocked: '+str(s)
s,h,b=req(origin+'/api/admin/login',urllib.parse.urlencode({'password':'invalid-test-password'}).encode(),{'Content-Type':'application/x-www-form-urlencoded','Origin':origin});assert s==303 and 'error=invalid' in h.get('Location',''),'wrong password rejected: '+str(s)
s,h,b=req(origin+'/api/admin/login',urllib.parse.urlencode({'password':cfg['password']}).encode(),{'Content-Type':'application/x-www-form-urlencoded','Origin':origin});assert s==303 and h.get('Location')=='/dash','login accepted: '+str(s)+' '+h.get('Location','')
cookie=h.get('Set-Cookie','');assert 'HttpOnly' in cookie and 'Secure' in cookie,'secure session cookie'
s,h,b=req(origin+'/dash',headers={'Cookie':cookie.split(';')[0]});assert s==200 and b'Dashboard' in b,'authenticated dashboard: '+str(s)
s,h,b=req(origin+'/dash/lotes',headers={'Cookie':cookie.split(';')[0]});assert s==200,'vehicle manager: '+str(s)
s,h,b=req(origin+'/loop-logo.png');assert s==200 and h.get('Content-Type','').startswith('image/'),'image assets: '+str(s)
s,h,b=req(portal+'/api/lookup',json.dumps({'query':'52998224725','code':'0'*32}).encode(),{'Content-Type':'application/json','Origin':portal});assert s==404,'portal connected and incorrect code rejected: '+str(s)
print('PASS: both health checks, dashboard protection, password login, secure cookie, vehicle manager, image proxy and portal lookup.',flush=True)
