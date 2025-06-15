
import React from 'react';
import { Clock, Clipboard, Lock } from 'lucide-react';

interface SummaryCard {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

interface SummaryCardsProps {
  cards: SummaryCard[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={card.onClick}
          >
            <div className={`${card.iconColor} p-3 rounded-lg mr-4`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">{card.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
