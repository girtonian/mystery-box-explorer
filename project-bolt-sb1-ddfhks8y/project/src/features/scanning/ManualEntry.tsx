/**
 * Manual code entry component for accessibility fallback
 * Allows users to type in attachment codes directly
 */

import React, { useState } from 'react';
import { Keyboard, HelpCircle, CheckCircle } from 'lucide-react';
import { useScannerStore } from '@/stores';
import { Button, Card } from '@/components';

const ManualEntry: React.FC = () => {
  const {
    manualCode,
    setManualCode,
    submitManualCode,
    error,
    clearError,
  } = useScannerStore();

  const [showHelp, setShowHelp] = useState(false);

  const handleCodeChange = (value: string) => {
    clearError();
    // Format code as user types (add hyphens for readability)
    const formatted = value
      .replace(/[^A-Z0-9]/g, '') // Remove non-alphanumeric
      .toUpperCase()
      .slice(0, 12); // Limit to 12 characters
    
    setManualCode(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.length >= 10) {
      await submitManualCode();
    }
  };

  const formatDisplayCode = (code: string) => {
    // Format as: CMFF-123456-A01
    if (code.length <= 4) return code;
    if (code.length <= 10) return `${code.slice(0, 4)}-${code.slice(4)}`;
    return `${code.slice(0, 4)}-${code.slice(4, 10)}-${code.slice(10)}`;
  };

  const isValidLength = manualCode.length >= 10;

  return (
    <div className="max-w-md mx-auto">
      <Card variant="default" padding="large">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Keyboard className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-primary">
            Enter Your Code
          </h3>
          <p className="text-gray-600">
            Type the code from your Curmunchkin attachment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code input */}
          <div>
            <label htmlFor="manual-code" className="block text-sm font-medium text-gray-700 mb-2">
              Attachment Code
            </label>
            <input
              id="manual-code"
              type="text"
              value={formatDisplayCode(manualCode)}
              onChange={(e) => handleCodeChange(e.target.value.replace(/-/g, ''))}
              placeholder="CMFF-123456-A01"
              className={`
                w-full px-4 py-3 text-lg font-mono text-center border-2 rounded-xl
                focus:ring-purple-500 focus:border-purple-500 transition-colors
                ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                ${isValidLength ? 'border-green-300 bg-green-50' : ''}
              `}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
            />
            
            {/* Validation feedback */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center text-sm">
                {isValidLength ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">Code format looks good!</span>
                  </>
                ) : (
                  <span className="text-gray-500">
                    {manualCode.length}/12 characters
                  </span>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="small"
                icon={HelpCircle}
                onClick={() => setShowHelp(!showHelp)}
                aria-label="Show help"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error.userFriendlyMessage}</p>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            size="touch"
            fullWidth
            disabled={!isValidLength}
          >
            Unlock Story
          </Button>
        </form>

        {/* Help section */}
        {showHelp && (
          <Card variant="outlined" padding="medium" className="mt-4 bg-blue-50 border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">Where to find your code:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Look for a QR code on your Curmunchkin attachment</li>
              <li>• The code is usually printed below or next to the QR code</li>
              <li>• It starts with "CM" followed by letters and numbers</li>
              <li>• Example: CMFF123456A01</li>
            </ul>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default ManualEntry;