import React from 'react';

interface ContratacionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

const ContratacionCard: React.FC<ContratacionCardProps> = ({
  title,
  description,
  icon,
  selected,
  onSelect
}) => {
  return (
    <div
      className={`p-6 border rounded-lg cursor-pointer transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center mb-3">
        {icon}
        <h3 className="text-lg font-semibold ml-3">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ContratacionCard;