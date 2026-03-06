import{P as s}from"./chunk-OXN6A6IX.js";var h=(()=>{class c{toCSV(t,n,o){if(!t?.length)return;let e=o||Object.keys(t[0]).map(r=>({key:r,header:r})),l=e.map(r=>`"${r.header}"`).join(","),i=t.map(r=>e.map(d=>{let p=this.getNestedValue(r,d.key);return`"${String(p??"").replace(/"/g,'""')}"`}).join(",")),a=[l,...i].join(`\r
`);this.download(a,`${n}.csv`,"text/csv;charset=utf-8;")}getNestedValue(t,n){return n.split(".").reduce((o,e)=>o?.[e],t)}download(t,n,o){let e=new Blob(["\uFEFF"+t],{type:o}),l=URL.createObjectURL(e),i=document.createElement("a");i.href=l,i.download=n,i.click(),URL.revokeObjectURL(l)}printElement(t){let n=document.getElementById(t);if(!n)return;let o=n.innerHTML,e=window.open("","_blank","width=900,height=700");e&&(e.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            thead { background: #f4f4f4; }
            .no-print { display: none !important; }
          </style>
        </head>
        <body>${o}</body>
      </html>
    `),e.document.close(),e.focus(),e.print(),e.close())}static{this.\u0275fac=function(n){return new(n||c)}}static{this.\u0275prov=s({token:c,factory:c.\u0275fac,providedIn:"root"})}}return c})();export{h as a};
