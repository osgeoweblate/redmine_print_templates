document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    basepdfField: document.getElementById('print_template_basepdf'),
    schemasField: document.getElementById('print_template_schemas'),
    trackerIdSelect: document.getElementById('print_template_tracker_id'),
    openBtn: document.getElementById('open-designer-fullscreen-btn'),
    closeBtn: document.getElementById('close-designer-fullscreen-btn'),
    designerOverlay: document.getElementById('designer-fullscreen'),
    iframe: document.getElementById('pdfme-designer-iframe'),
    uploadField: document.getElementById('pdf-upload'),
    templateDownloadBtn: document.getElementById('template_download-designer-fullscreen-btn'),
    templateUploadBtn: document.getElementById('template_upload-designer-fullscreen-btn'),
    templateFileInput: document.getElementById('template-file-input'),
    basepdfIcon: document.getElementById('basepdf-ok-icon')
  };

  const showError = (message) => {
    console.error(message);
    alert('An error occurred. Please try again.');
  };

  const parseJSON = (str, fallback = []) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return fallback;
    }
  };

  const loadTrackerData = () => {
    if (elements.trackerIdSelect) {
      Rails.ajax({
        url: `${elements.trackerIdSelect.getAttribute('data-url')}?tracker_id=${elements.trackerIdSelect.value}`,
        type: 'GET',
        dataType: 'json',
        success: (response) => {
          sessionStorage.setItem('fieldKeyOptions', JSON.stringify(response.fieldKeyOptions));
          sessionStorage.setItem('fieldFormatOptions', JSON.stringify(response.fieldFormatOptions));
        }
      });
    }
  };

  const handleTemplateDownloadClick = () => {
    const iframeWindow = elements.iframe.contentWindow;
    const trackerName = elements.trackerIdSelect.options[elements.trackerIdSelect.selectedIndex].text;

    iframeWindow.postMessage({
      type: 'downloadTemplate',
      data: { trackerName: trackerName }
    }, window.location.origin);
  };

  const handleTemplateUploadClick = () => {
    elements.templateFileInput.click();
  };

  const handleTemplateFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const templateData = JSON.parse(e.target.result);

          if (templateData.basePdf) {
            elements.basepdfField.value = templateData.basePdf;
            elements.uploadField.value = templateData.basePdf;
          } else {
            // Reset if 'basePdf' is not provided
            elements.basepdfField.value = '';
            elements.uploadField.value = '';
          }

          toggleBasePDFControls();

          const iframeWindow = elements.iframe.contentWindow;
          iframeWindow.postMessage({
            type: 'uploadTemplate',
            data: { templateData: templateData }
          }, window.location.origin);
        } catch (error) {
          showError('Failed to parse template file: ' + error);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid JSON template file.');
    }
  };

  const encodeBasePDF = (input) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const encodedPDF = e.target.result;
        if (elements.basepdfField) {
          elements.basepdfField.value = encodedPDF;
        }
        toggleBasePDFControls();
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  const toggleBasePDFControls = () => {
    if (elements.basepdfField && elements.basepdfField.value) {
      elements.basepdfIcon.style.display = 'inline';
    } else {
      elements.basepdfIcon.style.display = 'none';
    }
  };

  const handleOpenBtnClick = () => {
    elements.designerOverlay.style.display = 'block';
    const iframeWindow = elements.iframe.contentWindow;

    const data = {
      basePdf: elements.basepdfField.value || '',
      schemas: parseJSON(elements.schemasField.value, [[]]), // 1st array for pages, 2nd for fields
      fieldKeyOptions: parseJSON(sessionStorage.getItem('fieldKeyOptions')),
      fieldFormatOptions: parseJSON(sessionStorage.getItem('fieldFormatOptions'))
    };

    iframeWindow.postMessage({
      type: 'openDesigner',
      data: data
    }, window.location.origin);
  };

  const handleCloseBtnClick = () => {
    elements.designerOverlay.style.display = 'none';
    elements.iframe.src = elements.iframe.src; // Refresh the iframe
  };

  const handleMessageEvent = (event) => {
    if (event.origin !== window.location.origin) return;

    if (event.data.type === 'updateData') {
      const { schemas } = event.data.data;
      elements.schemasField.value = JSON.stringify(schemas);
    }
  };

  elements.trackerIdSelect?.addEventListener('change', loadTrackerData);
  loadTrackerData();

  elements.templateDownloadBtn?.addEventListener('click', handleTemplateDownloadClick);
  elements.templateUploadBtn?.addEventListener('click', handleTemplateUploadClick);
  elements.templateFileInput?.addEventListener('change', handleTemplateFileChange);

  elements.uploadField?.addEventListener('change', function() {
    encodeBasePDF(this);
  });

  elements.basepdfIcon?.addEventListener('click', (event) => {
    event.preventDefault();
    elements.basepdfField.value = '';
    elements.uploadField.value = '';
    toggleBasePDFControls();
  });

  elements.openBtn?.addEventListener('click', handleOpenBtnClick);
  elements.closeBtn?.addEventListener('click', handleCloseBtnClick);

  window.addEventListener('message', handleMessageEvent);
});
