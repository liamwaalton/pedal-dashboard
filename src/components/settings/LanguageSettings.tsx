
import React from 'react';

interface LanguageSettingsProps {
  language: string;
  setLanguage: (value: string) => void;
}

const LanguageSettings = ({ language, setLanguage }: LanguageSettingsProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Language</h3>
      <div className="max-w-xs">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-bike-blue"
        >
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          <option value="german">German</option>
          <option value="italian">Italian</option>
          <option value="portuguese">Portuguese</option>
          <option value="chinese">Chinese</option>
          <option value="japanese">Japanese</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSettings;
