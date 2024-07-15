// src/components/CSVUploader.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const App = () => {
  const [csvData, setCsvData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [pattern, setPattern] = useState('');

  const handleFileUpload = (e) => {
    setCsvData([])
    setExcelData([])
    const file = e.target.files[0];
    const fileType = file.name.split('.').pop().toLowerCase();

    if (fileType === 'csv') {
      parseCSV(file);
    } else if (['xls', 'xlsx'].includes(fileType)) {
      parseExcel(file);
    } else {
      alert('Unsupported file type. Please upload a CSV or Excel file.');
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        console.log('Parsed CSV data:', result.data);
        setCsvData(result.data.slice(0, 5)); // Preview first 5 rows
      },
      header: true,
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log('Parsed Excel data:', jsonData);
      setExcelData(jsonData.slice(0, 5)); // Preview first 5 rows
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePatternSubmit = async (e) => {
    e.preventDefault();
    // Handle pattern submission logic here
    console.log('Pattern submitted:', pattern);
    const response = await fetch("http://127.0.0.1:8000/api/generateregex", {
      method: "POST",
      body: JSON.stringify({
        nat_lang_input: pattern
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    console.log(response)
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="w-full p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Upload CSV or Excel</label>
            <input
              type="file"
              accept=".csv, .xls, .xlsx"
              onChange={handleFileUpload}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <form onSubmit={handlePatternSubmit} className="flex items-center mb-4">
            <input
              placeholder='Enter Pattern'
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              type="submit"
              className="ml-2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </form>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">File Preview (First 5 Rows)</h3>
            {csvData.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 mt-4">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(csvData[0]).map((header, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {csvData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {excelData.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 mt-4">
                  <thead className="bg-gray-50">
                    <tr>
                      {excelData[0].map((header, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {excelData.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((value, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {csvData.length === 0 && excelData.length === 0 && (
              <p className="text-sm text-gray-500 mt-4">No data to display. Please upload a file.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
