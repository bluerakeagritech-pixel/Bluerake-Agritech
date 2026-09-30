import React from 'react';
import { Link } from 'react-router-dom';
import { Car as Farm, FileText, Calculator, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('welcome')}</h1>
        <p className="mt-2 text-gray-600">
          {t('description')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/farm-data"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Farm className="h-8 w-8 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">{t('Farm Data')}</h2>
          <p className="mt-2 text-gray-600">{t('FarmData')}</p>
        </Link>

        <Link
          to="/financials"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <FileText className="h-8 w-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">{t('Financial Records')}</h2>
          <p className="mt-2 text-gray-600">{t('FinancialRecords')}</p>
        </Link>

        <Link
          to="/risk-assessment"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Calculator className="h-8 w-8 text-purple-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">{t('Risk Assessment')}</h2>
          <p className="mt-2 text-gray-600">{t('RiskAssessment')}</p>
        </Link>

        <Link
          to="/loan-application"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Wallet className="h-8 w-8 text-orange-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">{t('Apply Loan')}</h2>
          <p className="mt-2 text-gray-600">{t('ApplyLoan')}</p>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('Quick Actions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
            {t('Update Farm')}
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            {t('View RiskScore')}
          </button>
        </div>
      </div>
    </div>
  );
}
