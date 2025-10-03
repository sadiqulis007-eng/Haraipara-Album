import React from 'react';
import { Person } from '../types';
import { CakeIcon, NoteIcon, TrashIcon, PencilIcon, BriefcaseIcon } from './icons';

interface PersonCardProps {
  person: Person;
  onDelete: (id: string) => void;
  onEdit: (person: Person) => void;
  onView: (person: Person) => void;
  staggerIndex: number;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onDelete, onEdit, onView, staggerIndex }) => {

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(person.id);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(person);
  };
  
  const handleViewClick = () => {
    onView(person);
  };

  const photo = person.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&size=400`;

  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col cursor-pointer" 
      onClick={handleViewClick}
      style={{ '--stagger-index': staggerIndex } as React.CSSProperties}
    >
      <img className="w-full h-48 object-cover" src={photo} alt={person.name} onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&size=400`)} />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span>{person.name}</span>
            <span 
                className={`w-3 h-3 rounded-full ${person.status === 'alive' ? 'bg-emerald-500' : 'bg-slate-500'}`}
                title={person.status === 'alive' ? 'Alive' : 'Deceased'}
            ></span>
        </h3>
        <div className="space-y-3 text-slate-600 dark:text-slate-400 flex-grow mb-4">
          {person.profession && (
            <div className="flex items-center space-x-2 text-sm">
              <BriefcaseIcon className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">{person.profession}</span>
            </div>
          )}
          {person.birthday && (
            <div className="flex items-center space-x-2">
              <CakeIcon className="w-5 h-5 text-emerald-400" />
              <span>{person.birthday}</span>
            </div>
          )}
          {person.notes && (
            <div className="flex items-start space-x-2 pt-2">
              <NoteIcon className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
              <p className="text-sm leading-relaxed whitespace-pre-wrap truncate-3-lines">{person.notes}</p>
            </div>
          )}
        </div>
        <div className="mt-auto flex justify-end space-x-2 border-t border-slate-200 dark:border-slate-700 pt-3 -mx-5 px-5">
           <button
            onClick={handleEditClick}
            className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-2 rounded-full"
            aria-label="Edit person"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="text-slate-500 hover:text-red-600 dark:hover:text-red-500 transition-colors p-2 rounded-full"
            aria-label="Delete person"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
       <style>{`
        .truncate-3-lines {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
        }
      `}</style>
    </div>
  );
};

export default PersonCard;