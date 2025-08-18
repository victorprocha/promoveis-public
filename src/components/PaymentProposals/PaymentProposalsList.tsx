import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  ChevronDown, 
  ChevronRight,
  Calendar,
  DollarSign,
  Percent,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PaymentProposal } from "@/hooks/usePaymentProposals";
import { usePaymentInstallments } from "@/hooks/usePaymentProposals";

interface PaymentProposalsListProps {
  proposals: PaymentProposal[];
  onAddProposal: () => void;
  onSelectProposal: (id: string) => void;
  onDeleteProposal: (id: string) => void;
  loading?: boolean;
}

interface ProposalCardProps {
  proposal: PaymentProposal;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onSelect, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { installments } = usePaymentInstallments(proposal.id);

  const hasDiscount = proposal.discount_value > 0;
  const hasDownPayment = proposal.down_payment_value > 0;
  const discountAmount = proposal.total_amount - proposal.total_with_discount;

  return (
    <Card className={`transition-all ${proposal.is_selected ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{proposal.name}</CardTitle>
            {proposal.is_selected && (
              <Badge variant="default" className="bg-green-500">
                <Check className="h-3 w-3 mr-1" />
                Selecionada
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor Original:</span>
              <span className="font-medium">R$ {proposal.total_amount.toFixed(2)}</span>
            </div>
            
            {hasDiscount && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Desconto:</span>
                <span>- R$ {discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm font-medium">
              <span>Total:</span>
              <span>R$ {proposal.total_with_discount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            {hasDownPayment && (
              <div className="flex justify-between text-sm text-blue-600">
                <span>Entrada:</span>
                <span>R$ {proposal.down_payment_value.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Parcelas:</span>
              <span>{proposal.installments_count}x</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor da Parcela:</span>
              <span>R$ {(proposal.remaining_amount / proposal.installments_count).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {hasDiscount && (
            <Badge variant="secondary" className="text-xs">
              <Percent className="h-3 w-3 mr-1" />
              {proposal.discount_type === 'percentage' ? `${proposal.discount_value}%` : `R$ ${proposal.discount_value}`} desconto
            </Badge>
          )}
          
          {hasDownPayment && (
            <Badge variant="secondary" className="text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              {proposal.down_payment_type === 'percentage' ? `${proposal.down_payment_value}%` : `R$ ${proposal.down_payment_value}`} entrada
            </Badge>
          )}
          
          <Badge variant="outline" className="text-xs">
            <CreditCard className="h-3 w-3 mr-1" />
            {proposal.installments_count}x parcelas
          </Badge>
        </div>

        {/* Installments Details (Collapsible) */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-3">
            <div className="border-t pt-3">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Cronograma de Pagamentos
              </h4>
              
              <div className="space-y-2">
                {installments.map((installment, index) => (
                  <div key={installment.id} className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                    <div>
                      <span className="font-medium">
                        {installment.installment_number}ª parcela
                      </span>
                      {installment.notes && (
                        <span className="text-muted-foreground ml-2">({installment.notes})</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">R$ {installment.amount.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(installment.due_date), 'dd/MM/yyyy', { locale: ptBR })} • {installment.payment_method}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Actions */}
        <div className="flex justify-between items-center pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            Criado em {format(new Date(proposal.created_at), 'dd/MM/yyyy', { locale: ptBR })}
          </div>
          
          <div className="flex gap-2">
            {!proposal.is_selected && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onSelect(proposal.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Selecionar
              </Button>
            )}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Proposta</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir a proposta "{proposal.name}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(proposal.id)} className="bg-destructive hover:bg-destructive/90">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PaymentProposalsList: React.FC<PaymentProposalsListProps> = ({
  proposals,
  onAddProposal,
  onSelectProposal,
  onDeleteProposal,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Propostas de Pagamento
        </h3>
        
        <Button onClick={onAddProposal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Proposta
        </Button>
      </div>

      {proposals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma proposta de pagamento cadastrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Crie diferentes propostas de pagamento para oferecer opções flexíveis aos seus clientes.
            </p>
            <Button onClick={onAddProposal} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Proposta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onSelect={onSelectProposal}
              onDelete={onDeleteProposal}
            />
          ))}
        </div>
      )}
    </div>
  );
};