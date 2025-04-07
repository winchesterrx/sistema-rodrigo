
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageContainer from "@/components/PageContainer";
import FormActions from "@/components/FormActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsers, saveUser, deleteUser, searchUsers, User, getUserByCPF } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { validateCPF } from "@/utils/validation";

// Permissions available in the system
const availablePermissions = [
  { id: "all", label: "Acesso Completo" },
  { id: "view", label: "Visualizar Dados" },
  { id: "create", label: "Criar Registros" },
  { id: "edit", label: "Editar Registros" },
  { id: "delete", label: "Excluir Registros" },
];

const CadastroUsuarios = () => {
  const navigate = useNavigate();
  const { user: currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSheet, setOpenSheet] = useState(false);
  const [userForm, setUserForm] = useState<User>({
    name: "",
    cpf: "",
    dateOfBirth: "",
    password: "",
    permissions: ["view"]
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [activeTab, setActiveTab] = useState("usuarios");
  const [isSaving, setIsSaving] = useState(false);

  // Verificar se o usuário atual é admin para gerenciar outros usuários
  useEffect(() => {
    if (activeTab === "usuarios" && !currentUser?.isAdmin && !hasPermission("all")) {
      setActiveTab("senha");
      toast.info("Você não tem permissão para gerenciar usuários.");
    }
    loadUsers();
  }, [currentUser, activeTab, navigate, hasPermission]);

  const loadUsers = () => {
    if (currentUser?.isAdmin || hasPermission("all") || hasPermission("view")) {
      const loadedUsers = searchTerm ? searchUsers(searchTerm) : getUsers();
      setUsers(loadedUsers);
    }
  };

  const handleNewUser = () => {
    if (!currentUser?.isAdmin && !hasPermission("create")) {
      toast.error("Acesso negado. Você não tem permissão para criar novos usuários.");
      return;
    }

    setSelectedUser(null);
    setUserForm({
      name: "",
      cpf: "",
      dateOfBirth: "",
      password: "",
      permissions: ["view"]
    });
    setConfirmPassword("");
    setPasswordError("");
    setCpfError("");
    setIsEditing(false);
    setOpenSheet(true);
  };

  const handleEditUser = (user: User) => {
    if (!currentUser?.isAdmin && !hasPermission("edit")) {
      toast.error("Acesso negado. Você não tem permissão para editar usuários.");
      return;
    }

    setSelectedUser(user);
    setUserForm({
      ...user,
      password: "" // Clear password for security
    });
    setConfirmPassword("");
    setPasswordError("");
    setCpfError("");
    setIsEditing(true);
    setOpenSheet(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));

    // Clear errors when typing
    if (name === "cpf") {
      setCpfError("");
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setUserForm(prev => {
      const currentPermissions = prev.permissions || [];
      
      if (permissionId === "all" && checked) {
        // If "all" is selected, remove other permissions
        return { ...prev, permissions: ["all"] };
      } else if (checked) {
        // Add the permission, remove "all" if it exists
        const newPermissions = currentPermissions.filter(p => p !== "all");
        return { ...prev, permissions: [...newPermissions, permissionId] };
      } else {
        // Remove the permission
        return { ...prev, permissions: currentPermissions.filter(p => p !== permissionId) };
      }
    });
  };

  const handleSearch = () => {
    loadUsers();
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // CPF validation
    if (!userForm.cpf) {
      setCpfError("CPF é obrigatório");
      isValid = false;
    } else if (!validateCPF(userForm.cpf)) {
      setCpfError("CPF inválido");
      isValid = false;
    } else if (!isEditing) {
      // Check for duplicate CPF only when creating a new user
      const existingUser = getUserByCPF(userForm.cpf);
      if (existingUser) {
        setCpfError("Este CPF já está cadastrado");
        isValid = false;
      }
    }

    // Password validation for new users
    if (!isEditing && !userForm.password) {
      setPasswordError("Senha é obrigatória para novos usuários");
      isValid = false;
    } else if (userForm.password && userForm.password !== confirmPassword) {
      setPasswordError("As senhas não conferem");
      isValid = false;
    }

    return isValid;
  };

  const handleSave = () => {
    // Basic validation
    if (!userForm.name || !userForm.cpf || !userForm.dateOfBirth) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    // Advanced validation
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      saveUser(userForm);
      setOpenSheet(false);
      loadUsers();
      toast.success("Usuário salvo com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar usuário.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (cpf: string) => {
    if (!currentUser?.isAdmin && !hasPermission("delete")) {
      toast.error("Acesso negado. Você não tem permissão para excluir usuários.");
      return;
    }

    deleteUser(cpf);
    loadUsers();
    toast.success("Usuário excluído com sucesso!");
  };

  const handleCancel = () => {
    setOpenSheet(false);
  };

  // Formatar CPF
  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <PageContainer title="Usuários">
      <Tabs 
        defaultValue={currentUser?.isAdmin || hasPermission("all") ? "usuarios" : "senha"} 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          {(currentUser?.isAdmin || hasPermission("all") || hasPermission("view")) && (
            <TabsTrigger value="usuarios">Gerenciar Usuários</TabsTrigger>
          )}
          <TabsTrigger value="senha">Alterar Minha Senha</TabsTrigger>
        </TabsList>

        {(currentUser?.isAdmin || hasPermission("all") || hasPermission("view")) && (
          <TabsContent value="usuarios" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Pesquisar Usuários</CardTitle>
                <CardDescription>Busque usuários por nome ou CPF</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                  <div className="w-full sm:w-96">
                    <Label htmlFor="searchTerm">Nome ou CPF</Label>
                    <Input
                      id="searchTerm"
                      placeholder="Digite para buscar"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <FormActions
                    onPesquisar={handleSearch}
                    onIncluir={handleNewUser}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usuários Cadastrados</CardTitle>
                <CardDescription>Lista de todos os usuários do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Data de Nascimento</TableHead>
                      <TableHead>Administrador</TableHead>
                      <TableHead>Permissões</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.cpf}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{formatCPF(user.cpf)}</TableCell>
                        <TableCell>{new Date(user.dateOfBirth).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{user.isAdmin ? "Sim" : "Não"}</TableCell>
                        <TableCell>
                          {user.permissions ? 
                            (user.permissions.includes("all") ? 
                              "Acesso Completo" : 
                              user.permissions.map(p => 
                                availablePermissions.find(ap => ap.id === p)?.label || p
                              ).join(", ")
                            ) : 
                            "Visualizar"
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {(currentUser?.isAdmin || hasPermission("edit")) && (
                              <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                Editar
                              </Button>
                            )}
                            {(currentUser?.isAdmin || hasPermission("delete")) && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    Excluir
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o usuário {user.name}?
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(user.cpf)}>
                                      Confirmar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Nenhum usuário encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="senha">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="w-[500px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{isEditing ? "Editar Usuário" : "Novo Usuário"}</SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Modifique os dados do usuário conforme necessário"
                : "Preencha os dados para criar um novo usuário"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                value={userForm.name}
                onChange={handleChange}
                placeholder="Nome do usuário"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                value={userForm.cpf}
                onChange={handleChange}
                placeholder="Digite apenas números"
                disabled={isEditing}
              />
              {cpfError && <p className="text-sm text-red-500">{cpfError}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={userForm.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={userForm.password}
                onChange={handleChange}
                placeholder={isEditing ? "Deixe em branco para manter a mesma senha" : "Digite a senha"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirme a Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a senha"
              />
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                id="isAdmin"
                name="isAdmin"
                type="checkbox"
                checked={!!userForm.isAdmin}
                onChange={(e) => setUserForm(prev => ({ ...prev, isAdmin: e.target.checked }))}
                className="h-4 w-4"
              />
              <Label htmlFor="isAdmin" className="cursor-pointer">
                Usuário administrador
              </Label>
            </div>
            
            {!userForm.isAdmin && (
              <div className="space-y-2">
                <Label>Permissões</Label>
                <div className="space-y-2 border rounded-md p-3">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`permission-${permission.id}`}
                        checked={(userForm.permissions || []).includes(permission.id)}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.id, checked === true)
                        }
                      />
                      <label
                        htmlFor={`permission-${permission.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <FormActions
            onIncluir={handleSave}
            onCancelar={handleCancel}
            isEditing={isEditing}
            isSaving={isSaving}
          />
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
};

export default CadastroUsuarios;
