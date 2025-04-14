# PDF Redaction Tool - Setup & Usage Guide

## Prerequisites

### 1. Node.js and npm
- Install **Node.js version 20 or higher**
- Verify installation:
  ```bash
  node -v
  npm -v
  ```

### 2. Python 3.11
- Install **Python 3.11 or higher**
- Verify installation:
  ```bash
  python --version
  ```

---

## Installation Steps

### 1. Clone the repository
```bash
git clone <repository-url>
cd pdf-redaction-tool
```

### 2. Install Node.js dependencies
```bash
npm install
```

### 3. Install Python dependencies
```bash
pip install PyMuPDF
```

### 4. Create temporary directories
```bash
mkdir -p temp/uploads temp/redacted
```

---

## Running the Application

### 1. Start the development server
```bash
npm run dev
```

### 2. Access the application
- Open your browser and go to:
  ```
  http://localhost:5000
  ```

---

## Application Structure

- `client/src`: Frontend React components  
- `server`: Backend Node.js API and Python processing script  
- `shared`: Shared type definitions and schemas  
- `temp`: Temporary storage for uploads and processed files  

---

## Using the Application

### 1. Upload Step
- Drag and drop a **PDF file** or click to browse  
- Only **PDF files** are accepted  

### 2. Processing Step
- The application **automatically processes** the document  
- It identifies and redacts **person names** and **phone numbers**  

### 3. Download Step
- View **redaction statistics** (number of redacted items)  
- Download the **redacted PDF**  
- Option to **start over** with a new document  

---

## Technical Information

- The application uses a **Node.js/Express backend** and **React frontend**
- **PDF processing** is handled by a Python script using **PyMuPDF**
- Redacted documents are stored **temporarily for 24 hours** before being automatically removed
