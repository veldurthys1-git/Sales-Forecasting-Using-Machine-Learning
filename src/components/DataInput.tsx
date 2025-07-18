import React, { useState } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { SalesData } from '../types';

interface DataInputProps {
  data: SalesData[];
  onDataChange: (data: SalesData[]) => void;
}

export const DataInput: React.FC<DataInputProps> = ({ data, onDataChange }) => {
  const [newEntry, setNewEntry] = useState({ date: '', sales: '' });

  const handleAddEntry = () => {
    if (newEntry.date && newEntry.sales) {
      const newData = [...data, {
        date: newEntry.date,
        sales: parseFloat(newEntry.sales),
        period: data.length + 1
      }];
      onDataChange(newData);
      setNewEntry({ date: '', sales: '' });
    }
  };

  const handleRemoveEntry = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    const reindexedData = newData.map((item, i) => ({ ...item, period: i + 1 }));
    onDataChange(reindexedData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').slice(1); // Skip header
        const parsedData: SalesData[] = [];

        lines.forEach((line, index) => {
          const [date, sales] = line.split(',');
          if (date && sales) {
            parsedData.push({
              date: date.trim(),
              sales: parseFloat(sales.trim()),
              period: index + 1
            });
          }
        });

        onDataChange(parsedData);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Sales Data Input</h2>
      
      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload CSV File
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> CSV file
              </p>
              <p className="text-xs text-gray-500">Format: Date, Sales</p>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Manual Entry */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Add Entry Manually</h3>
        <div className="flex gap-3">
          <input
            type="date"
            value={newEntry.date}
            onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Sales Amount"
            value={newEntry.sales}
            onChange={(e) => setNewEntry({ ...newEntry, sales: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddEntry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Data Table */}
      {data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Sales</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Period</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{item.date}</td>
                  <td className="border border-gray-300 px-4 py-2">${item.sales.toLocaleString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.period}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleRemoveEntry(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};