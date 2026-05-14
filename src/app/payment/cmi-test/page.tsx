'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function CmiTestContent() {
  const [formHtml, setFormHtml] = useState<string>('');
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'PRODUCTION';

  useEffect(() => {
    // Generate a fresh payment form
    fetch(`/api/payment/signature-test?mode=${mode}`)
      .then(res => res.json())
      .then(data => {
        if (data.testLink) {
          // Parse the URL to extract parameters
          const url = new URL(data.testLink);
          const params = url.searchParams;
          
          // Build form HTML
          let formFields = '';
          params.forEach((value, key) => {
            formFields += `<input type="hidden" name="${key}" value="${value}" />\n`;
          });
          
          const html = `
<form id="cmiForm" method="POST" action="${url.origin + url.pathname}">
${formFields}
</form>
<script>document.getElementById('cmiForm').submit();</script>
          `.trim();
          
          setFormHtml(html);
        }
      })
      .catch(err => {
        setFormHtml(`Error: ${err.message}`);
      });
  }, [mode]);

  if (!formHtml) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Generating CMI payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
        <h1 className="text-xl font-bold text-stone-900 mb-4">CMI Payment Test</h1>
        <p className="text-stone-600 mb-6">
          Mode: <span className="font-mono font-bold text-blue-600">{mode}</span>
        </p>
        <p className="text-sm text-stone-500 mb-4">
          This page will auto-submit a POST form to CMI. If it does not redirect automatically, 
          copy the form below and submit it manually.
        </p>
        
        <div className="bg-slate-100 p-4 rounded-lg overflow-auto max-h-64 mb-6">
          <pre className="text-xs text-stone-700 whitespace-pre-wrap">{formHtml}</pre>
        </div>
        
        <button
          onClick={() => {
            const div = document.createElement('div');
            div.innerHTML = formHtml;
            document.body.appendChild(div);
            const form = div.querySelector('form');
            if (form) form.submit();
          }}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Submit Payment Form Manually
        </button>
      </div>
    </div>
  );
}

export default function CmiTestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    }>
      <CmiTestContent />
    </Suspense>
  );
}
