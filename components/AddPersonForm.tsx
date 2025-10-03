import React, { useState, useEffect, useCallback } from 'react';
import { Person } from '../types';
import { XMarkIcon, UserIcon } from './icons';

interface AddPersonFormProps {
  onSave: (person: Omit<Person, 'id'> & { id?: string }) => void;
  onClose: () => void;
  personToEdit: Person | null;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & { label: string; isTextArea?: boolean; list?: string; }> = ({ label, id, isTextArea, list, ...props }) => {
  const commonClasses = "w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow";
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      {isTextArea ? (
        <textarea id={id} {...props} className={commonClasses} rows={4} />
      ) : (
        <input id={id} {...props} className={commonClasses} list={list} />
      )}
    </div>
  );
};

const AddPersonForm: React.FC<AddPersonFormProps> = ({ onSave, onClose, personToEdit }) => {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [profession, setProfession] = useState('');
  const [status, setStatus] = useState<'alive' | 'deceased'>('alive');

  useEffect(() => {
    if (personToEdit) {
      setName(personToEdit.name);
      setBirthday(personToEdit.birthday);
      setPhotoUrl(personToEdit.photoUrl);
      setNotes(personToEdit.notes);
      setProfession(personToEdit.profession || '');
      setStatus(personToEdit.status || 'alive');
    }
  }, [personToEdit]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = 'auto'; };
  }, [handleKeyDown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert('Name is required.'); return; }
    if (!photoUrl) { alert('Photo is required.'); return; }
    onSave({ id: personToEdit?.id, name, birthday, photoUrl, notes, profession, status });
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoUrl(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const isEditing = !!personToEdit;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-wipe-in-down" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">{isEditing ? 'Edit Family Member' : 'Add New Family Member'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><XMarkIcon className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <InputField label="Full Name" id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Photo</label>
            <div className="flex items-center gap-4">
              <span className="h-20 w-20 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                {photoUrl ? (<img src={photoUrl} alt="Preview" className="h-full w-full object-cover" />) : (<UserIcon className="h-full w-full text-slate-400 dark:text-slate-500 p-2" />)}
              </span>
              <label htmlFor="photo-upload" className="cursor-pointer bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-sm font-medium px-3 py-2 rounded-md transition-colors">
                Upload Image
                <input id="photo-upload" name="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
              </label>
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" value="alive" checked={status === 'alive'} onChange={() => setStatus('alive')} className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-300">Alive</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" value="deceased" checked={status === 'deceased'} onChange={() => setStatus('deceased')} className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-300">Deceased</span>
              </label>
            </div>
          </div>
          <InputField label="Profession (Optional)" id="profession" type="text" value={profession} onChange={e => setProfession(e.target.value)} placeholder="e.g., Doctor, Engineer" />
          <InputField label="Birthday" id="birthday" type="date" value={birthday} onChange={e => setBirthday(e.target.value)} />
          <InputField label="Notes (Optional)" id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything special to remember..." isTextArea />
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-md transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-md transition-colors">{isEditing ? 'Save Changes' : 'Save Member'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPersonForm;