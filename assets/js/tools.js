/* No forms transmit personal data unless a verified secure endpoint is configured. */
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('[data-check]');
  if (app) {
    const steps=[...app.querySelectorAll('[data-step]')];
    const next=app.querySelector('[data-next]');
    const back=app.querySelector('[data-back]');
    const label=app.querySelector('[data-progress-label]');
    const bar=app.querySelector('[data-progress-bar]');
    const error=app.querySelector('[data-error]');
    const controls=app.querySelector('.tool-controls');
    const result=app.querySelector('[data-result]');
    const answers={}; let current=1;
    const render=(focus=false)=>{
      steps.forEach(s=>{
        const active=Number(s.dataset.step)===current;
        s.classList.toggle('active',active);
        s.setAttribute('aria-hidden',String(!active));
      });
      label.textContent=`FRAGE ${String(current).padStart(2,'0')} / 05`;
      bar.style.width=`${current*20}%`;
      back.disabled=current===1;
      next.textContent=current===5?'Ergebnis ansehen →':'Weiter →';
      error.hidden=true;
      if (focus) steps[current-1].querySelector('h3')?.focus?.();
    };
    steps.forEach(s=>s.querySelector('h3')?.setAttribute('tabindex','-1'));
    next?.addEventListener('click',()=>{
      const chosen=steps[current-1].querySelector('input:checked');
      if (!chosen) { error.hidden=false; steps[current-1].querySelector('input')?.focus();return; }
      answers[chosen.name]=chosen.value;
      if(current<5){current++;render(true);return;}
      // The score is only a non-diagnostic conversation guide, not engineering advice.
      const score=(answers.year==='Ab 2010'?2:answers.year==='1995–2009'?1:0)
         +(answers.emitters==='Fußbodenheizung'?2:answers.emitters==='Moderne / größere Heizkörper'?1:0)
         +(answers.insulation==='Gut saniert'?2:answers.insulation==='Teilweise saniert'?1:0);
      let title='Eine genauere Prüfung ist sinnvoll.';
      let copy='Aus diesen Angaben ergibt sich keine technische Entscheidung. Heizlast, Vorlauftemperatur, Aufstellort und weitere Gebäudedaten sollten fachlich geprüft werden.';
      if(score>=5){title='Mehrere günstige Ausgangspunkte erkennbar.';copy='Ihre Antworten nennen einige Merkmale, die eine Wärmepumpe begünstigen können. Eine Eignung ist damit nicht bestätigt. Entscheidend sind unter anderem Heizlast und erforderliche Systemtemperaturen.';}
      if(score<=2){title='Gebäudedaten genauer ansehen.';copy='Einzelne Angaben erfordern besondere Prüfung, schließen eine Wärmepumpe aber nicht pauschal aus. Das Ergebnis ist keine Empfehlung für oder gegen ein System.';}
      app.querySelector('[data-result-title]').textContent=title;
      app.querySelector('[data-result-copy]').textContent=copy;
      const names={building:'Gebäude',year:'Baujahr',system:'Heizsystem',emitters:'Heizflächen',insulation:'Energetischer Zustand'};
      app.querySelector('[data-result-summary]').textContent=Object.entries(answers).map(([k,v])=>`${names[k]}: ${v}`).join(' · ');
      steps.forEach(s=>{s.classList.remove('active');s.setAttribute('aria-hidden','true');});
      controls.hidden=true;error.hidden=true;result.hidden=false;result.focus();
    });
    back?.addEventListener('click',()=>{if(current>1){current--;render(true);}});
    app.querySelector('[data-restart]')?.addEventListener('click',()=>{
      current=1;Object.keys(answers).forEach(k=>delete answers[k]);
      app.querySelectorAll('input[type="radio"]').forEach(i=>i.checked=false);
      result.hidden=true;controls.hidden=false;render(true);
    });
    render();
  }

  // Local-only, valid ICS reminder; no server booking or appointment confirmation.
  document.querySelectorAll('[data-reminder-form]').forEach(form=>{
    const dateInput=form.querySelector('[name="reminderDate"]');
    if(dateInput){
      const minDate=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
      dateInput.min=minDate();
    }
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const date=dateInput?.value;
      const title=form.querySelector('[name="reminderTitle"]')?.value || 'Haustechnik-Wartung prüfen';
      const feedback=form.querySelector('[data-reminder-feedback]');
      if(!date || date<dateInput.min){feedback.textContent='Bitte wählen Sie ein heutiges oder zukünftiges Datum.';feedback.className='form-feedback error';return;}
      const [year,month,day]=date.split('-').map(Number);
      const pad=x=>String(x).padStart(2,'0');
      const starts=`${year}${pad(month)}${pad(day)}T090000`;
      const ends=`${year}${pad(month)}${pad(day)}T093000`;
      const now=new Date();
      const stamp=`${now.getUTCFullYear()}${pad(now.getUTCMonth()+1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
      const escape=s=>String(s).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
      const ics=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//KlarWaerme//Calendar Reminder//DE','BEGIN:VEVENT',`UID:${Date.now()}-${Math.round(Math.random()*1e9)}@local.invalid`,`DTSTAMP:${stamp}`,`DTSTART:${starts}`,`DTEND:${ends}`,`SUMMARY:${escape(title)}`,'DESCRIPTION:Persönliche Erinnerung für eine Wartungsanfrage. Keine Terminbuchung.','END:VEVENT','END:VCALENDAR'].join('\r\n')+'\r\n';
      const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));
      const a=document.createElement('a');a.href=url;a.download='klarwaerme-wartungserinnerung.ics';a.style.display='none';document.body.append(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1500);
      feedback.textContent='Kalenderdatei erstellt. Importieren Sie sie in Ihren Kalender. Es wurde kein Termin gebucht.';feedback.className='form-feedback success';
    });
  });

  document.querySelectorAll('[data-funding-check]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const values=new FormData(form),owner=values.get('owner'),existing=values.get('existing'),contracted=values.get('contracted');
    const output=form.querySelector('[data-funding-result]');
    output.hidden=false;output.replaceChildren();
    const title=document.createElement('b');title.textContent='Ihre unverbindliche Prüfliste';output.append(title);
    const list=document.createElement('ul');
    [`Eigentümerstatus: ${owner} – aktuelle KfW-Voraussetzungen prüfen.`,`Gebäude: ${existing} – Fördergegenstand und Gebäudekategorie klären.`,contracted==='Ja'?'Bereits beauftragt: Prüfen Sie umgehend die Antragsbedingungen, Fristen und den erforderlichen Vertragstext.':'Noch nicht beauftragt: Reihenfolge von Antrag und Beauftragung mit den aktuellen Vorgaben abgleichen.','Fördersätze, Förderfähigkeit und technische Mindestanforderungen immer über die offiziellen Informationsstellen prüfen.'].forEach(t=>{const li=document.createElement('li');li.textContent=t;list.append(li);});
    const link=document.createElement('a');link.href='https://www.kfw.de/inlandsfoerderung/Heizungsfoerderung/index.html';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Offizielle KfW-Informationen ↗';
    const note=document.createElement('p');note.textContent='Kein Förderrechner, keine Förderzusage und keine rechtliche oder technische Beratung.';
    output.append(list,note,link);output.focus();
  }));

  // Validate local attachments before exposing them to a future endpoint.
  const allowed=new Set(['image/jpeg','image/png','image/webp','application/pdf']);
  document.querySelectorAll('[data-files]').forEach(input=>input.addEventListener('change',()=>{
    const target=input.closest('label')?.querySelector('[data-file-list]');
    const files=[...input.files];
    const tooMany=files.length>3;
    const invalid=files.some(f=>!allowed.has(f.type)||f.size>5*1024*1024);
    if(tooMany||invalid){
      input.value='';
      if(target){target.textContent=tooMany?'Bitte wählen Sie maximal 3 Dateien.':'Nur JPG, PNG, WEBP oder PDF bis 5 MB pro Datei sind erlaubt.';target.classList.add('file-error');}
      return;
    }
    if(target){target.textContent=files.length?files.map(f=>f.name).join(' · '):'Keine Dateien gewählt.';target.classList.remove('file-error');}
  }));

  document.querySelectorAll('[data-enquiry-form]').forEach(form=>form.addEventListener('submit',async e=>{
    e.preventDefault();
    const feedback=form.querySelector('[data-feedback]');
    feedback.className='form-feedback';feedback.replaceChildren();
    if(!form.reportValidity()){feedback.className='form-feedback error';feedback.textContent='Bitte vervollständigen Sie die Pflichtfelder und prüfen Sie Ihre Eingaben.';return;}
    const inputFiles=[...(form.querySelector('[data-files]')?.files||[])];
    if(inputFiles.length>3||inputFiles.some(f=>!allowed.has(f.type)||f.size>5*1024*1024)){
      feedback.className='form-feedback error';feedback.textContent='Bitte prüfen Sie die Dateiauswahl (max. 3 Dateien à 5 MB, nur Bilder oder PDF).';return;
    }
    const data=new FormData(form);const fields=[];
    const fieldNames={service:'Anliegen',building:'Gebäude',name:'Name',email:'E-Mail',phone:'Telefon',location:'Ort',date:'Wunschtermin',time:'Tageszeit',message:'Beschreibung',urgency:'Dringlichkeit'};
    for(const [k,value] of data.entries())if(!['consent','photos'].includes(k)&&String(value).trim())fields.push(`${fieldNames[k]||k}: ${String(value).trim()}`);
    if(inputFiles.length)fields.push('Ausgewählte Dateien: '+inputFiles.map(f=>f.name).join(', '));
    const summary=`Anfrageentwurf für KlarWärme Haustechnik\n\n${fields.join('\n')}\n\nVorschau: nicht versendet.`;
    const endpoint=window.KLARWAERME_CONFIG?.formEndpoint?.trim()||'';
    if(endpoint){
      let resolved;
      try{resolved=new URL(endpoint,location.href);if(resolved.protocol!=='https:')throw new Error('HTTPS erforderlich');}
      catch{feedback.className='form-feedback error';feedback.textContent='Konfigurationsfehler: Der Formular-Endpunkt muss eine gültige HTTPS-Adresse sein.';return;}
      const submit=form.querySelector('[type="submit"]');if(submit){submit.disabled=true;submit.textContent='Wird übermittelt …';}
      try{
        const response=await fetch(resolved.href,{method:'POST',body:data,headers:{Accept:'application/json'},credentials:'omit'});
        if(!response.ok)throw new Error('HTTP '+response.status);
        feedback.className='form-feedback success';feedback.textContent='Die Anfrage wurde an den konfigurierten Dienst übermittelt. Eine Bestätigung der Annahme oder eines Termins ist damit nicht verbunden.';
        form.reset();
        const fileLabel=form.querySelector('[data-file-list]');if(fileLabel)fileLabel.textContent='';
      }catch{
        feedback.className='form-feedback error';feedback.textContent='Die Anfrage konnte nicht übermittelt werden. Bitte versuchen Sie es später erneut.';
      }finally{if(submit){submit.disabled=false;submit.textContent='Anfrage senden ↗';}}
      return;
    }
    feedback.className='form-feedback demo-feedback';
    const p=document.createElement('p');p.textContent='Vorschaumodus: Es wurde nichts gesendet. Kopieren Sie Ihre Übersicht. Ausgewählte Dateien werden nicht mitkopiert.';
    const pre=document.createElement('pre');pre.textContent=summary;pre.tabIndex=0;
    const button=document.createElement('button');button.type='button';button.textContent='Anfrageübersicht kopieren';
    button.addEventListener('click',async()=>{
      try{if(!navigator.clipboard?.writeText)throw new Error();await navigator.clipboard.writeText(summary);button.textContent='Text kopiert ✓';}
      catch{pre.focus();button.textContent='Bitte Text manuell markieren und kopieren';}
    });
    feedback.append(p,pre,button);
  }));
  // Visible call-to-action must reflect demo status; no mock success or fake booking.
  document.querySelectorAll('[data-enquiry-form] [type="submit"]').forEach(button=>{
    if(window.KLARWAERME_CONFIG?.formEndpoint)button.textContent='Anfrage senden ↗';
  });
});
