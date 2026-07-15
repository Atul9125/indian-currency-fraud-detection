const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const panelIdle = document.getElementById('panelIdle');
const panelPreview = document.getElementById('panelPreview');
const previewImg = document.getElementById('previewImg');
const statusLine = document.getElementById('statusLine');
const statusText = document.getElementById('statusText');
const verdict = document.getElementById('verdict');
const verdictSeal = document.getElementById('verdictSeal');
const verdictWord = document.getElementById('verdictWord');
const confidenceValue = document.getElementById('confidenceValue');
const confidenceFill = document.getElementById('confidenceFill');
const verdictNote = document.getElementById('verdictNote');
const resetBtn = document.getElementById('resetBtn');

dropzone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) handleFile(e.target.files[0]);
});

['dragenter', 'dragover'].forEach(evt =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  })
);

['dragleave', 'drop'].forEach(evt =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
  })
);

dropzone.addEventListener('drop', (e) => {
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

resetBtn.addEventListener('click', resetUI);

function handleFile(file) {
  if (!file.type.match('image/(png|jpeg|jpg)')) {
    setStatus('Only PNG or JPG images are accepted', false);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    panelIdle.hidden = true;
    panelPreview.hidden = false;
    dropzone.classList.add('scanning');
    verdict.hidden = true;
    resetBtn.hidden = true;
    statusLine.className = 'status-line active';
    setStatus('Scanning security features…');
  };
  reader.readAsDataURL(file);

  uploadFile(file);
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const startTime = Date.now();

  try {
    const res = await fetch('/predict', { method: 'POST', body: formData });
    const data = await res.json();

    // keep the scan animation visible for a beat even if the server was fast
    const elapsed = Date.now() - startTime;
    const wait = Math.max(0, 1400 - elapsed);
    setTimeout(() => {
      if (data.error) {
        setStatus('Error: ' + data.error, false);
        dropzone.classList.remove('scanning');
        return;
      }
      showVerdict(data);
    }, wait);

  } catch (err) {
    setStatus('Could not reach the server — is app.py running?', false);
    dropzone.classList.remove('scanning');
  }
}

function showVerdict(data) {
  dropzone.classList.remove('scanning');

  const isReal = data.label === 'real';
  verdictSeal.className = isReal ? 'real' : 'fake';
  verdictWord.textContent = isReal ? 'Genuine' : 'Counterfeit';
  confidenceValue.textContent = data.confidence + '%';
  confidenceFill.className = 'confidence-fill ' + (isReal ? 'real' : 'fake');

  verdictNote.textContent = isReal
    ? 'Security features match patterns consistent with a genuine note.'
    : 'Patterns inconsistent with genuine security features were detected.';

  verdict.hidden = false;
  resetBtn.hidden = false;

  requestAnimationFrame(() => {
    confidenceFill.style.width = data.confidence + '%';
  });

  statusLine.className = 'status-line ' + (isReal ? 'done-real' : 'done-fake');
  setStatus(isReal ? 'Verified as genuine' : 'Flagged as counterfeit');
}

function setStatus(text) {
  statusText.textContent = text;
}

function resetUI() {
  panelIdle.hidden = false;
  panelPreview.hidden = true;
  verdict.hidden = true;
  resetBtn.hidden = true;
  fileInput.value = '';
  statusLine.className = 'status-line';
  setStatus('Awaiting a note image');
}
