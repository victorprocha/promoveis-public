import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Edit, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const emitenteSchema = z.object({
  cnpj: z.string().min(14, "CNPJ deve ter 14 dígitos").max(14, "CNPJ deve ter 14 dígitos"),
  razao_social: z.string().min(1, "Razão Social é obrigatória"),
  nome_fantasia: z.string().optional(),
  inscricao_estadual: z.string().optional(),
  inscricao_municipal: z.string().optional(),
  cnae: z.string().optional(),
  crt: z.string().min(1, "CRT é obrigatório"),
  cep: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  estado: z.string().optional(),
  cidade: z.string().optional(),
  ibge: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  telefone: z.string().optional(),
  contato: z.string().optional(),
  situacao: z.string().optional(),
  ambiente: z.string().min(1, "Ambiente é obrigatório"),
  senha_certificado: z.string().optional(),
  ultima_nfe: z.number().min(0).optional(),
  serie_nfe: z.number().min(0).optional(),
});

type EmitenteFormData = z.infer<typeof emitenteSchema>;

export default function EmitenteNFe() {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<EmitenteFormData>({
    resolver: zodResolver(emitenteSchema),
    defaultValues: {
      crt: "Simples Nacional",
      situacao: "ATIVA",
      ambiente: "Homologação",
      ultima_nfe: 0,
      serie_nfe: 0,
    },
  });

  useEffect(() => {
    loadEmitenteData();
  }, []);

  const loadEmitenteData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("emitente_nfe")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        form.reset(data);
        setHasData(true);
        setEditMode(false);
      } else {
        setEditMode(true);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar os dados do emitente",
        variant: "destructive",
      });
    }
  };

  const handleCertificateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCertificateFile(file);
    }
  };

  const uploadCertificate = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/certificate_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('company-logos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const onSubmit = async (data: EmitenteFormData) => {
    if (!user) return;

    setLoading(true);

    try {
      let certificateUrl = null;
      if (certificateFile) {
        certificateUrl = await uploadCertificate(certificateFile);
      }

      const submitData = {
        user_id: user.id,
        cnpj: data.cnpj || '',
        razao_social: data.razao_social || '',
        ...data,
        ...(certificateUrl && { certificado_url: certificateUrl }),
      };

      if (hasData) {
        const { error } = await supabase
          .from("emitente_nfe")
          .update(submitData)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("emitente_nfe")
          .insert(submitData);

        if (error) throw error;
        setHasData(true);
      }

      setEditMode(false);
      toast({
        title: "Sucesso",
        description: "Dados do emitente salvos com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar os dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Emitente NF-e</h1>
        <div className="flex gap-2">
          {!editMode && hasData && (
            <Button onClick={() => setEditMode(true)} variant="secondary">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Dados do Emitente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados do Emitente e Parâmetros da NF-e</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                {...form.register("cnpj")}
                disabled={!editMode}
                placeholder="00.000.000/0000-00"
                maxLength={14}
              />
              {form.formState.errors.cnpj && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.cnpj.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="razao_social">Razão social *</Label>
              <Input
                id="razao_social"
                {...form.register("razao_social")}
                disabled={!editMode}
              />
              {form.formState.errors.razao_social && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.razao_social.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="nome_fantasia">Nome fantasia</Label>
              <Input
                id="nome_fantasia"
                {...form.register("nome_fantasia")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="inscricao_estadual">Inscrição estadual</Label>
              <Input
                id="inscricao_estadual"
                {...form.register("inscricao_estadual")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="inscricao_municipal">Inscrição municipal</Label>
              <Input
                id="inscricao_municipal"
                {...form.register("inscricao_municipal")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="cnae">CNAE</Label>
              <Input
                id="cnae"
                {...form.register("cnae")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="crt">CRT - (Regime Tributário) *</Label>
              <Select
                value={form.watch("crt")}
                onValueChange={(value) => form.setValue("crt", value)}
                disabled={!editMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Simples Nacional">Simples Nacional</SelectItem>
                  <SelectItem value="Lucro Presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="Lucro Real">Lucro Real</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                {...form.register("cep")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                {...form.register("endereco")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                {...form.register("numero")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                {...form.register("bairro")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                {...form.register("estado")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                {...form.register("cidade")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="ibge">IBGE</Label>
              <Input
                id="ibge"
                {...form.register("ibge")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                {...form.register("telefone")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="contato">Contato</Label>
              <Input
                id="contato"
                {...form.register("contato")}
                disabled={!editMode}
              />
            </div>

            <div>
              <Label htmlFor="situacao">Situação</Label>
              <Select
                value={form.watch("situacao")}
                onValueChange={(value) => form.setValue("situacao", value)}
                disabled={!editMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVA">ATIVA</SelectItem>
                  <SelectItem value="INATIVA">INATIVA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Configurações da Nota Fiscal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground bg-muted p-3 rounded">
              Configurações da Nota fiscal:
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Alertas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 text-center font-medium">
                  Atenção!<br />
                  O sistema está setado para emissão em modo de Homologação.
                </AlertDescription>
              </Alert>

              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 text-center font-medium">
                  Certificado!<br />
                  Sem Certificado.
                </AlertDescription>
              </Alert>
            </div>

            {/* Configurações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ambiente">Ambiente</Label>
                <Select
                  value={form.watch("ambiente")}
                  onValueChange={(value) => form.setValue("ambiente", value)}
                  disabled={!editMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Homologação">Homologação</SelectItem>
                    <SelectItem value="Produção">Produção</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Buscar Certificado</Label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".p12,.pfx"
                    onChange={handleCertificateUpload}
                    disabled={!editMode}
                    className="hidden"
                    id="certificate-upload"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('certificate-upload')?.click()}
                    disabled={!editMode}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Buscar Certificado
                  </Button>
                  <Input
                    placeholder="••••••"
                    type="password"
                    {...form.register("senha_certificado")}
                    disabled={!editMode}
                    className="flex-1"
                  />
                </div>
                {certificateFile && (
                  <p className="text-sm text-muted-foreground">
                    Certificado selecionado: {certificateFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Nota Fiscal Eletrônica */}
            <div>
              <h3 className="font-medium mb-3">Nota Fiscal Eletrônica - NF-e</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ultima_nfe">Última NF-e</Label>
                  <Input
                    id="ultima_nfe"
                    type="number"
                    {...form.register("ultima_nfe", { valueAsNumber: true })}
                    disabled={!editMode}
                  />
                </div>

                <div>
                  <Label htmlFor="serie_nfe">Série NF-e</Label>
                  <Input
                    id="serie_nfe"
                    type="number"
                    {...form.register("serie_nfe", { valueAsNumber: true })}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {editMode && (
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}