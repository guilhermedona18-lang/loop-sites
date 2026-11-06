import paths from './asset-routes.json' with {type:'json'};
const origin="https://kaua-contratos-painel.kauahenriquemariaalv.chatgpt.site";
export default {images:{unoptimized:true},experimental:{serverActions:{bodySizeLimit:'12mb'}},async rewrites(){return {afterFiles:paths.map(source=>({source,destination:origin+source}))};}};
