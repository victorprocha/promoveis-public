
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editNote, setEditNote] = useState({ title: '', content: '' });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar notas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notas.",
        variant: "destructive",
      });
    } else {
      setNotes(data || []);
    }
  };

  const createNote = async () => {
    if (!newNote.title.trim() || !user) return;

    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          title: newNote.title,
          content: newNote.content,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar nota:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a nota.",
        variant: "destructive",
      });
    } else {
      setNotes([data, ...notes]);
      setNewNote({ title: '', content: '' });
      setIsCreating(false);
      toast({
        title: "Sucesso",
        description: "Nota criada com sucesso!",
      });
    }
  };

  const updateNote = async (id: string) => {
    if (!editNote.title.trim()) return;

    const { data, error } = await supabase
      .from('notes')
      .update({
        title: editNote.title,
        content: editNote.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar nota:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a nota.",
        variant: "destructive",
      });
    } else {
      setNotes(notes.map(note => note.id === id ? data : note));
      setEditingId(null);
      toast({
        title: "Sucesso",
        description: "Nota atualizada com sucesso!",
      });
    }
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar nota:', error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a nota.",
        variant: "destructive",
      });
    } else {
      setNotes(notes.filter(note => note.id !== id));
      toast({
        title: "Sucesso",
        description: "Nota deletada com sucesso!",
      });
    }
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditNote({ title: note.title, content: note.content });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditNote({ title: '', content: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#2A3F54]">Minhas Notas</h1>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-[#28A745] hover:bg-[#218838] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Nota
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isCreating && (
            <Card className="border-2 border-dashed border-[#007BFF]">
              <CardHeader>
                <Input
                  placeholder="Título da nota"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Conteúdo da nota..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="min-h-32 mb-4"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={createNote}
                    size="sm"
                    className="bg-[#28A745] hover:bg-[#218838]"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreating(false);
                      setNewNote({ title: '', content: '' });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {notes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                {editingId === note.id ? (
                  <Input
                    value={editNote.title}
                    onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                  />
                ) : (
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(note)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNote(note.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <CardDescription>
                  Atualizada em: {formatDate(note.updated_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editingId === note.id ? (
                  <>
                    <Textarea
                      value={editNote.content}
                      onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                      className="min-h-32 mb-4"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateNote(note.id)}
                        size="sm"
                        className="bg-[#28A745] hover:bg-[#218838]"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {notes.length === 0 && !isCreating && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma nota encontrada</p>
            <p className="text-gray-400">Clique em "Nova Nota" para começar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
