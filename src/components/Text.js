import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import PropTypes from 'prop-types';
import { Document, Packer, Paragraph } from 'docx';
import saveAs from 'file-saver';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Text(props) {
  const [text, setText] = useState("");
  const [fileFormat, setFileFormat] = useState("txt");
  const [fontSize, setFontSize] = useState(14);
  const textareaRef = useRef(null);

  const handleOnChange = (e) => setText(e.target.value);

  const handleUpperCase = () => {
    setText(text.toUpperCase());
  };

  const handleLowerCase = () => {
    setText(text.toLowerCase());
  };

  const handleCapitalCase = () => {
    setText(
      text
        .toLowerCase()
        .replace(/\b(\w)/g, (char) => char.toUpperCase())
    );
  };

  const handleClear = () => {
    setText("");
    toast.info("Text cleared successfully!");
  };

  const handleCopy = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      navigator.clipboard.writeText(textareaRef.current.value);
      toast.success("Text copied to clipboard!");
    }
  };

  const handleOnClickDownload = () => {
    if (text.length === 0) {
      toast.error("Please enter some text before downloading.");
      return;
    }

    if (fileFormat === "txt") {
      downloadText("TEXT.txt", text);
    } else if (fileFormat === "pdf") {
      downloadPDF("TEXT.pdf", text);
    } else if (fileFormat === "md") {
      downloadText("TEXT.md", text);
    } else if (fileFormat === "docx") {
      downloadDOCX("TEXT.docx", text);
    }

    toast.success(`Your file has been downloaded as ${fileFormat.toUpperCase()}!`);
  };

  const downloadText = (file, text) => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", file);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadPDF = (file, text) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const lineHeight = 18;
    const maxLineWidth = pageWidth - margin * 2;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setLineWidth(1);
    doc.line(margin, margin + 10, pageWidth - margin, margin + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const splitText = doc.splitTextToSize(text, maxLineWidth);
    let yPosition = margin + 40;

    splitText.forEach((line) => {
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    doc.save(file);
  };

  const downloadDOCX = (file, text) => {
    const doc = new Document({
      sections: [{ children: [new Paragraph(text)] }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, file);
    });
  };

  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
  const charCount = text.length;
  const lineCount = text === "" ? 0 : text.split(/\r\n|\r|\n/).length; 

  const readTime = (0.08 * wordCount).toFixed(2);

  return (
    <div className="container my-4">
      <h3 className="text-center">{props.heading}</h3>
      <div className="mb-3">
        <textarea
          className="form-control"
          onChange={handleOnChange}
          value={text}
          ref={textareaRef}
          placeholder="Enter your Text"
          id="TEXTAREA"
          rows="8"
          style={{ fontSize: `${fontSize}px` }}
        ></textarea>
      </div>
      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-primary mx-1" onClick={handleUpperCase}>
          UPPERCASE
        </button>
        <button className="btn btn-primary mx-1" onClick={handleLowerCase}>
          lowercase
        </button>
        <button className="btn btn-primary mx-1" onClick={handleCapitalCase}>
          Capital Case
        </button>
        <button className="btn btn-primary mx-1" onClick={handleClear}>
          Clear
        </button>
        <button className="btn btn-primary mx-1" onClick={handleCopy}>
          Copy
        </button>
        <select
          className="form-select mx-1"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
        >
          <option value={12}>12</option>
          <option value={14}>14</option>
          <option value={16}>16</option>
        </select>
        <select
          className="form-select mx-1"
          value={fileFormat}
          onChange={(e) => setFileFormat(e.target.value)}
        >
          <option value="txt">TXT</option>
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
        </select>
        <button className="btn btn-success mx-1" onClick={handleOnClickDownload} disabled={text.length === 0}>
          Download
        </button>
      </div>

      <div className="container">
  <h3>Your Text Summary</h3>
  <ul className="list-unstyled">
    <li><strong>Number of words:</strong> {wordCount}</li>
    <li><strong>Number of characters:</strong> {charCount}</li>
    <li><strong>Number of lines:</strong> {lineCount}</li>
    <li><strong>Estimated reading time:</strong> {readTime} minutes</li>
  </ul>
  <h2>Preview</h2>
  <pre>{text}</pre>
</div>


      <ToastContainer 
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        draggable
      />
    </div>
  );
}

Text.propTypes = {
  heading: PropTypes.string.isRequired,
};
