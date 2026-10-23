"use strict";
var SKILLS=["javascript","typescript","python","sql","excel","project management","team leadership","operations","customer support","livechat","crm","salesforce","hubspot","zendesk","data analysis","budgeting","scheduling","training","quality assurance","process improvement","stakeholder","communication","reporting","dashboard","automation","api","git","agile","scrum","inventory","logistics","e-commerce","shopify","wordpress","seo","google sheets","power bi","tableau"];
var STOP=new Set("the and for with you will our are this that from have has job role work team years experience required requirements including ability strong skills knowledge plus etc per day".split(" "));
function normalizeTerm(s){return String(s||"").toLowerCase().replace(/[^a-z0-9+# ]/g," ").replace(/\s+/g," ").trim().replace(/ies$/,"y").replace(/s$/,"");}
function tokenize(text){return String(text||"").toLowerCase().replace(/[^a-z0-9+# ]/g," ").split(/\s+/).filter(Boolean);}
function extractKeywords(jdText,limit){var lim=limit||30;var text=String(jdText||"").toLowerCase();var found=[];
SKILLS.forEach(function(s){if(text.includes(s))found.push({term:s,source:"skills",count:(text.split(s).length-1)});});
var freq={};tokenize(jdText).forEach(function(w){if(w.length<4||STOP.has(w))return;freq[w]=(freq[w]||0)+1;});
Object.keys(freq).filter(function(w){return freq[w]>=2&&!found.some(function(f){return f.term===w;});}).sort(function(a,b){return freq[b]-freq[a];}).slice(0,15).forEach(function(w){found.push({term:w,source:"frequency",count:freq[w]});});
return found.slice(0,lim);}
function containsTerm(textNorm,term){var t=normalizeTerm(term);if(!t)return false;if(textNorm.includes(t))return true;return textNorm.split(" ").map(normalizeTerm).includes(t);}
function matchKeywords(resumeText,keywords){var norm=" "+tokenize(resumeText).join(" ")+" ";var found=[],missing=[];
(keywords||[]).forEach(function(k){var term=typeof k==="string"?k:k.term;if(containsTerm(norm,term)||norm.includes(" "+normalizeTerm(term)+" ")||norm.includes(term.toLowerCase()))found.push(term);else missing.push(term);});
return{found:found,missing:missing,total:(keywords||[]).length,coverage:(keywords&&keywords.length)?Math.round(found.length/keywords.length*100):0};}
function checkSections(text){var t=String(text||"").toLowerCase();var want={summary:/summary|profile|objective/,experience:/experience|employment|work history/,education:/education|degree|university|college/,skills:/skills|competenc|technologies/};var out={};Object.keys(want).forEach(function(k){out[k]=want[k].test(t);});return out;}
function checkContact(text){var s=String(text||"");return{email:/[\w.+-]+@[\w-]+\.[\w.]+/.test(s),phone:/\+?\d[\d\s().-]{7,}\d/.test(s),linkedin:/linkedin\.com/i.test(s)};}
function findQuantifiedBullets(text){return String(text||"").split(/\n/).filter(function(l){return /^\s*[-*\u2022]/.test(l)&&/\d+(\.\d+)?\s*(%|percent|\$|k\b|\+|hours|days|agents|people|team|tickets|customers)/i.test(l);});}
function wordCount(text){return tokenize(text).length;}
function scoreBreakdown(resumeText,jdText){var kw=extractKeywords(jdText);var m=matchKeywords(resumeText,kw);var sec=checkSections(resumeText);var con=checkContact(resumeText);var qb=findQuantifiedBullets(resumeText);var wc=wordCount(resumeText);
var cats={keywords:m.coverage,sections:Math.round(Object.values(sec).filter(Boolean).length/Object.keys(sec).length*100),contact:Math.round([con.email,con.phone].filter(Boolean).length/2*100),impact:qb.length>=5?100:qb.length*20,length:(wc>=300&&wc<=1200)?100:(wc<300?Math.round(wc/3):60)};
var overall=Math.round(Object.values(cats).reduce(function(a,b){return a+b;},0)/Object.keys(cats).length);
return{categories:cats,overall:overall,keywords:m,sections:sec,contact:con,quantifiedCount:qb.length,wordCount:wc};}
function buildReport(resumeText,jdText){var s=scoreBreakdown(resumeText,jdText);var lines=["# Resume Match Report","","Overall: "+s.overall+"/100","Words: "+s.wordCount,"","## Category scores"];Object.keys(s.categories).forEach(function(k){lines.push("- "+k+": "+s.categories[k]+"/100");});
lines.push("","## Found keywords",s.keywords.found.join(", ")||"None","", "## Missing keywords",s.keywords.missing.join(", ")||"None","", "## Sections");Object.keys(s.sections).forEach(function(k){lines.push("- "+k+": "+(s.sections[k]?"present":"missing"));});lines.push("","Quantified bullets: "+s.quantifiedCount);return lines.join("\n");}
const api={SKILLS:SKILLS,normalizeTerm:normalizeTerm,tokenize:tokenize,extractKeywords:extractKeywords,matchKeywords:matchKeywords,checkSections:checkSections,checkContact:checkContact,findQuantifiedBullets:findQuantifiedBullets,wordCount:wordCount,scoreBreakdown:scoreBreakdown,buildReport:buildReport};
if(typeof module!=="undefined"&&module.exports){module.exports=api;}
if(typeof window!=="undefined"){window.ResumeJdMatchLint=api;}
