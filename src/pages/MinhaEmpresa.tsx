import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Building, Upload, Loader2, Edit } from 'lucide-react';

const companySchema = z.object({
  razao_social: z.string().min(1, 'Razão Social é obrigatória'),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve conter exatamente 14 números'),
  ie: z.string().min(1, 'IE é obrigatória'),
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  uf: z.string().min(1, 'UF é obrigatória'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyInfo extends CompanyFormData {
  id?: string;
  logo_url?: string;
}

const MinhaEmpresa: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      razao_social: '',
      cnpj: '',
      ie: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      uf: '',
      telefone: '',
      email: '',
    },
  });

  useEffect(() => {
    loadCompanyInfo();
  }, [user]);

  const loadCompanyInfo = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCompanyInfo(data);
        setIsEditMode(false);
        form.reset({
          razao_social: data.razao_social,
          cnpj: data.cnpj,
          ie: data.ie,
          logradouro: data.logradouro,
          numero: data.numero,
          bairro: data.bairro,
          cidade: data.cidade,
          uf: data.uf,
          telefone: data.telefone,
          email: data.email,
        });
        if (data.logo_url) {
          setLogoPreview(data.logo_url);
        }
      } else {
        setIsEditMode(true);
      }
    } catch (error) {
      console.error('Erro ao carregar informações da empresa:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar informações da empresa.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !user) return null;

    try {
      setUploadingLogo(true);
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${user.id}/logo.${fileExt}`;

      // Delete existing logo if exists
      if (companyInfo?.logo_url) {
        const oldPath = companyInfo.logo_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('company-logos')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, logoFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da logo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload da logo.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    if (!user) return;

    try {
      setLoading(true);

      let logoUrl = companyInfo?.logo_url || null;
      
      // Upload logo if a new one was selected
      if (logoFile) {
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        }
      }

      const companyData = {
        user_id: user.id,
        razao_social: data.razao_social,
        cnpj: data.cnpj,
        ie: data.ie,
        logradouro: data.logradouro,
        numero: data.numero,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        telefone: data.telefone,
        email: data.email,
        logo_url: logoUrl,
      };

      let result;
      if (companyInfo?.id) {
        // Update existing record
        result = await supabase
          .from('company_info')
          .update(companyData)
          .eq('id', companyInfo.id)
          .select()
          .single();
      } else {
        // Insert new record
        result = await supabase
          .from('company_info')
          .insert(companyData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setCompanyInfo(result.data);
      setIsEditMode(false);
      setLogoFile(null);
      toast({
        title: 'Sucesso',
        description: 'Informações da empresa salvas com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao salvar informações da empresa:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar informações da empresa.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !companyInfo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Building className="h-8 w-8" />
          Minha Empresa
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie as informações da sua empresa
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Logo Upload Section */}
              <div className="space-y-4">
                <FormLabel>Logo da Empresa</FormLabel>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">130x130px</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      disabled={!isEditMode}
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-500">
                      Tamanho recomendado: 130 x 130 pixels
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="razao_social"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Razão Social *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite a razão social" disabled={!isEditMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="00.000.000/0000-00" disabled={!isEditMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inscrição Estadual *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite a IE" disabled={!isEditMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logradouro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logradouro *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Rua, Avenida, etc." disabled={!isEditMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número" disabled={!isEditMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Bairro" disabled={!isEditMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Cidade" disabled={!isEditMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="uf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UF *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="SP" maxLength={2} disabled={!isEditMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(11) 99999-9999" disabled={!isEditMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="empresa@exemplo.com" disabled={!isEditMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                {!isEditMode && companyInfo && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditMode(true)}
                    className="min-w-[120px] mr-4"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
                {isEditMode && (
                  <Button
                    type="submit"
                    disabled={loading || uploadingLogo}
                    className="min-w-[120px]"
                  >
                    {loading || uploadingLogo ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Salvar
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinhaEmpresa;