import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Person } from './types';
import Header from './components/Header';
import PersonCard from './components/PersonCard';
import AddPersonForm from './components/AddPersonForm';
import { CakeIcon, NoteIcon, PlusIcon, XMarkIcon, SearchIcon, BriefcaseIcon } from './components/icons';

const APP_STORAGE_KEY = 'family-album-data';
const AUTH_STORAGE_KEY = 'family-album-auth';

const Footer: React.FC = () => (
  <footer className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
    Developed by Sadiqul Islam Sayeem
  </footer>
);

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1122') {
      onLogin();
    } else {
      setError('Invalid PIN.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-xs p-8 space-y-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-emerald-600 dark:text-emerald-400">Haraipara Album</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
            required
            autoFocus
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

const PhotoViewerModal: React.FC<{ imageUrl: string; alt: string; onClose: () => void; }> = ({ imageUrl, alt, onClose }) => {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
    }, [onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          document.body.style.overflow = 'auto';
        };
    }, [handleKeyDown]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[60] flex items-center justify-center p-4 animate-wipe-in-down" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10" aria-label="Close image viewer">
                <XMarkIcon className="w-8 h-8 text-white" />
            </button>
            <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <img src={imageUrl} alt={alt} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
            </div>
        </div>
    );
};


const PersonViewModal: React.FC<{ person: Person; onClose: () => void; onPhotoClick: (url: string) => void; }> = ({ person, onClose, onPhotoClick }) => {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
    }, [onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          document.body.style.overflow = 'auto';
        };
    }, [handleKeyDown]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-wipe-in-down" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 flex justify-end">
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto px-6 pb-8 text-center">
                    <img className="w-48 h-48 rounded-full object-cover mx-auto mb-6 shadow-lg cursor-pointer transition-transform hover:scale-105" src={person.photoUrl} alt={person.name} onClick={() => onPhotoClick(person.photoUrl)} />
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                        {person.name}
                        <span className={`capitalize text-sm font-semibold px-3 py-1 rounded-full ${person.status === 'alive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                            {person.status}
                        </span>
                    </h2>
                    <div className="space-y-4 text-slate-600 dark:text-slate-400 max-w-md mx-auto text-left">
                        {person.birthday && ( <div className="flex items-center space-x-3"><CakeIcon className="w-6 h-6 text-emerald-400" /><span>{person.birthday}</span></div> )}
                        {person.profession && ( <div className="flex items-center space-x-3"><BriefcaseIcon className="w-6 h-6 text-emerald-400" /><span>{person.profession}</span></div> )}
                        {person.notes && ( <div className="flex items-start space-x-3 pt-2"><NoteIcon className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" /><p className="text-base leading-relaxed whitespace-pre-wrap">{person.notes}</p></div> )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmationModal: React.FC<{ person: Person; onClose: () => void; onConfirm: (pin: string) => void; error: string; }> = ({ person, onClose, onConfirm, error }) => {
    const [pin, setPin] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(pin);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-sm flex flex-col animate-wipe-in-down" onClick={e => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <h2 className="text-xl font-bold mb-2">Delete {person.name}?</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">This action cannot be undone. Please enter the deletion PIN to confirm.</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Deletion PIN"
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-center"
                            required
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm text-left mt-2">{error}</p>}
                        <div className="flex justify-end gap-3 pt-6">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-md transition-colors">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors">Delete</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const GalleryCard: React.FC<{ person: Person; onView: (person: Person) => void; staggerIndex: number; }> = ({ person, onView, staggerIndex }) => {
  const photo = person.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&size=500`;

  return (
    <div
      className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onClick={() => onView(person)}
      style={{ '--stagger-index': staggerIndex } as React.CSSProperties}
    >
      <img
        className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
        src={photo}
        alt={person.name}
        onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&size=500`)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5">
        <h3 className="text-2xl font-bold text-white tracking-wide shadow-black [text-shadow:1px_1px_2px_var(--tw-shadow-color)]">{person.name}</h3>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem(AUTH_STORAGE_KEY));
  const [people, setPeople] = useState<Person[]>(() => { try { const d = localStorage.getItem(APP_STORAGE_KEY); return d ? JSON.parse(d) : []; } catch (e) { return []; } });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [viewingPerson, setViewingPerson] = useState<Person | null>(null);
  const [viewingPhotoUrl, setViewingPhotoUrl] = useState<string | null>(null);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'gallery'>('card');
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);

  useEffect(() => { localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(people)); }, [people]);
  
  useEffect(() => {
    const handler = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  
  const handleInstallClick = () => {
    if (!installPrompt) return;
    const promptEvent = installPrompt as any; // Type casting for non-standard event
    promptEvent.prompt();
    promptEvent.userChoice.then(() => {
        setInstallPrompt(null);
    });
  };

  const handleLogin = () => { localStorage.setItem(AUTH_STORAGE_KEY, 'true'); setIsAuthenticated(true); };
  const handleLogout = () => { localStorage.removeItem(AUTH_STORAGE_KEY); setIsAuthenticated(false); };

  const savePerson = (personData: Omit<Person, 'id'> & { id?: string }) => {
    const data = { ...personData, profession: personData.profession?.trim() || '' };
    if (data.id) { setPeople(p => p.map(i => i.id === data.id ? { ...i, ...data } as Person : i).sort((a,b) => a.name.localeCompare(b.name))); } 
    else { const newPerson: Person = { ...data, id: crypto.randomUUID() } as Person; setPeople(p => [...p, newPerson].sort((a, b) => a.name.localeCompare(b.name))); }
    closeForm();
  };
  
  const handleConfirmDelete = (pin: string) => {
    if (!personToDelete) return;
    if (pin === '1213') {
      setPeople(prev => prev.filter(p => p.id !== personToDelete.id));
      setPersonToDelete(null);
      setDeleteError('');
    } else {
      setDeleteError('Incorrect PIN. Deletion cancelled.');
    }
  };

  const openAddForm = () => { setEditingPerson(null); setIsFormVisible(true); };
  const openEditForm = (person: Person) => { setEditingPerson(person); setIsFormVisible(true); };
  const closeForm = () => { setIsFormVisible(false); setEditingPerson(null); };

  const filteredPeople = useMemo(() => {
    if (!searchTerm) return people;
    const term = searchTerm.toLowerCase();
    return people.filter(p => p.name.toLowerCase().includes(term) || p.notes.toLowerCase().includes(term) || p.profession?.toLowerCase().includes(term));
  }, [people, searchTerm]);

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;
  
  const gridClasses = viewMode === 'card' 
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children"
    : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children";

  return (
    <div className="min-h-screen flex flex-col animate-wipe-in-right">
      <Header 
        onLogout={handleLogout} 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
        showInstallButton={!!installPrompt}
        onInstallClick={handleInstallClick}
      />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="relative">
            <input type="text" placeholder="Search by name, notes, profession..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {filteredPeople.length > 0 ? (
          <div className={gridClasses}>
            {filteredPeople.map((person, index) => (
                viewMode === 'card' ? (
                    <PersonCard key={person.id} person={person} onDelete={() => setPersonToDelete(person)} onEdit={openEditForm} onView={setViewingPerson} staggerIndex={index} />
                ) : (
                    <GalleryCard key={person.id} person={person} onView={setViewingPerson} staggerIndex={index} />
                )
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold text-slate-500 dark:text-slate-400">
              {searchTerm ? `No results for "${searchTerm}"` : 'Your Family Album is Empty'}
            </h2>
            <p className="mt-2 text-slate-400 dark:text-slate-500">
              {searchTerm ? 'Try a different search term.' : "Click the '+' button to add your first family member."}
            </p>
          </div>
        )}
      </main>

      <button onClick={openAddForm} className="fixed bottom-20 right-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50" aria-label="Add new person">
        <PlusIcon className="w-8 h-8" />
      </button>

      {isFormVisible && ( <AddPersonForm onSave={savePerson} onClose={closeForm} personToEdit={editingPerson} /> )}
      {viewingPerson && ( <PersonViewModal person={viewingPerson} onClose={() => setViewingPerson(null)} onPhotoClick={(url) => setViewingPhotoUrl(url)} /> )}
      {viewingPhotoUrl && <PhotoViewerModal imageUrl={viewingPhotoUrl} alt="Full size view" onClose={() => setViewingPhotoUrl(null)} />}
      {personToDelete && ( <DeleteConfirmationModal person={personToDelete} onClose={() => { setPersonToDelete(null); setDeleteError(''); }} onConfirm={handleConfirmDelete} error={deleteError} /> )}
      
      <Footer />
    </div>
  );
};

export default App;