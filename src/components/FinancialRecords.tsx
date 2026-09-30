import React from 'react';
import { LineChart, DollarSign, FileText, TrendingUp, CreditCard, MapPin, ShieldCheck } from 'lucide-react';

const FinancialRecords = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Financial Records</h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Export Records
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold">GH₵124,750</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className="text-2xl font-semibold">32.8%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <LineChart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl font-semibold">+15.2%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Income/Expense Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Add Income/Expense</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Description" className="border rounded-lg px-4 py-2" />
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">GH₵</span>
            <input type="number" placeholder="Amount" className="border rounded-lg px-4 py-2 pl-12" />
          </div>
          <select className="border rounded-lg px-4 py-2">
            <option value="">Select Category</option>
            <option value="Revenue">Revenue</option>
            <option value="Expense">Expense</option>
          </select>
          <input type="date" className="border rounded-lg px-4 py-2" />
          <button type="submit" className="col-span-1 md:col-span-2 bg-green-600 text-white rounded-lg py-2 hover:bg-green-700">
            Add Record
          </button>
        </form>
      </div>

      {/* Previous Loans and Repayments */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-red-500" /> Loan History
        </h2>
        <ul className="space-y-3">
          <li className="flex justify-between">
            <span>Loan from Rural Bank</span>
            <span className="text-red-600">-GH₵5,000</span>
          </li>
          <li className="flex justify-between">
            <span>Repayment - Feb 2025</span>
            <span className="text-green-600">+GH₵1,000</span>
          </li>
        </ul>
      </div>

      {/* Market Access */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-yellow-600" /> Market Access
        </h2>
        <p><strong>Distance to Market:</strong> 12 km</p>
        <p><strong>Cooperative Membership:</strong> Yes (Golden Cocoa Co-op)</p>
      </div>

      {/* Insurance Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-500" /> Insurance Status
        </h2>
        <p><strong>Crop Insurance:</strong> Active (Valid till Dec 2025)</p>
        <p><strong>Provider:</strong> Ghana AgriInsure</p>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-right py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">2025-01-15</td>
                <td className="py-3 px-4">Seed Purchase</td>
                <td className="py-3 px-4">Supplies</td>
                <td className="py-3 px-4 text-right text-red-600">-GH₵2,500</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">2025-01-12</td>
                <td className="py-3 px-4">Crop Sale</td>
                <td className="py-3 px-4">Revenue</td>
                <td className="py-3 px-4 text-right text-green-600">+GH₵8,750</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">2025-01-10</td>
                <td className="py-3 px-4">Equipment Maintenance</td>
                <td className="py-3 px-4">Maintenance</td>
                <td className="py-3 px-4 text-right text-red-600">-GH₵1,200</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialRecords;