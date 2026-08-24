import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Modal, ModalBody, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { Sidebar, SidebarClose, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAppState } from "@/hooks/use-app-state";
import { useChat } from "@/hooks/use-chat";
import { usePathname, useRouter } from "expo-router";
import { Bot, Edit, EllipsisVertical, FolderOpen, Library, Pause, Pencil, Pin, PinOff, Settings2, Sparkles, Trash2, Workflow } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { Conversation } from "@/core/types/app-state";
import { cn } from "@/core/utils";
import { useTheme } from "@/hooks/use-theme";

export function AppSidebar() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { hydrating } = useAppState();
  const { conversations, createConversation, currentConversation, renameConversation, runStatusByConversation, selectConversation } = useChat();
  const [renameTarget, setRenameTarget] = useState<Conversation | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const [renaming, setRenaming] = useState(false);
  const pinned = conversations.filter((c) => c.pinnedAt);
  const others = conversations.filter((c) => !c.pinnedAt);
  const go = (path: string) => router.push(path as never);
  const newTask = () => createConversation().then(() => go("/")).catch(console.error);

  function renderConversation(conversation: Conversation) {
    const active = conversation.id === currentConversation?.id;
    const status = runStatusByConversation[conversation.id];
    const running = ["running", "queued", "resumable"].includes(status ?? "");
    const waiting = ["waiting_for_approval", "waiting_for_question"].includes(status ?? "");
    return <SidebarMenuItem key={conversation.id}><SidebarClose asChild><SidebarMenuButton isActive={active} onPress={() => selectConversation(conversation.id).then(() => go("/")).catch(console.error)}><View className="min-w-0 flex-1 flex-row items-center gap-sp-2"><View className={cn("h-7 w-7 items-center justify-center rounded-lg", active ? "bg-background/15" : "bg-muted dark:bg-muted-dark")}><Bot color={active ? theme.background : theme.textSecondary} size={15} /></View><Text className={cn("min-w-0 flex-1 font-sans text-sm font-medium", active ? "text-background dark:text-background-dark" : "text-foreground dark:text-foreground-dark")} numberOfLines={1}>{conversation.title}</Text>{running ? <ActivityIndicator color={active ? theme.background : theme.textSecondary} size="small" /> : waiting ? <Pause color={active ? theme.background : theme.textSecondary} size={14} /> : <ChatOptions conversationId={conversation.id} color={active ? theme.background : theme.textSecondary} pinned={Boolean(conversation.pinnedAt)} pinnedCount={pinned.length} onRename={() => { setRenameTarget(conversation); setRenameTitle(conversation.title); setRenameError(null); }} />}</View></SidebarMenuButton></SidebarClose></SidebarMenuItem>;
  }

  const submitRename = () => {
    if (!renameTarget || !renameTitle.trim() || renaming) return;
    setRenaming(true); setRenameError(null);
    renameConversation(renameTarget.id, renameTitle.trim()).then(() => setRenameTarget(null)).catch((e) => setRenameError(e instanceof Error ? e.message : "Could not rename this task.")).finally(() => setRenaming(false));
  };

  return <>
    <Sidebar>
      <SidebarHeader className="gap-sp-3">
        <View className="flex-row items-center gap-sp-3 px-sp-1"><View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary"><Sparkles color={theme.background} size={20} /></View><View className="min-w-0 flex-1"><Text className="font-sans text-lg font-bold text-foreground dark:text-foreground-dark">PAPYLO J</Text><Text className="font-sans text-[10px] font-semibold tracking-widest text-muted-foreground dark:text-muted-foreground-dark">AGENT WORKSPACE</Text></View></View>
        <Button accessibilityLabel="New task" onPress={newTask} size="sm"><Edit color={theme.background} size={16} /><Text>New task</Text></Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pb-sp-1"><SidebarGroupLabel className="!px-1 text-xs font-bold uppercase tracking-widest">Workspace</SidebarGroupLabel><SidebarMenu>
          <SidebarMenuItem><SidebarClose asChild><SidebarMenuButton isActive={pathname === "/"} leftIcon={<Sparkles color={pathname === "/" ? theme.background : theme.text} size={17} />} onPress={() => go("/")}>Agent</SidebarMenuButton></SidebarClose></SidebarMenuItem>
          <SidebarMenuItem><SidebarClose asChild><SidebarMenuButton isActive={pathname === "/library"} leftIcon={<Library color={pathname === "/library" ? theme.background : theme.text} size={17} />} onPress={() => go("/library")}>Library</SidebarMenuButton></SidebarClose></SidebarMenuItem>
          <SidebarMenuItem><SidebarClose asChild><SidebarMenuButton leftIcon={<FolderOpen color={theme.text} size={17} />} onPress={() => go("/library")}>Files & memory</SidebarMenuButton></SidebarClose></SidebarMenuItem>
          <SidebarMenuItem><SidebarClose asChild><SidebarMenuButton leftIcon={<Workflow color={theme.text} size={17} />} onPress={() => go("/")}>Automations</SidebarMenuButton></SidebarClose></SidebarMenuItem>
        </SidebarMenu></SidebarGroup>
        {pinned.length > 0 ? <SidebarGroup><SidebarGroupLabel className="!px-1 text-xs font-bold uppercase tracking-widest">Pinned</SidebarGroupLabel><SidebarMenu>{pinned.map(renderConversation)}</SidebarMenu></SidebarGroup> : null}
        <SidebarGroup><SidebarGroupLabel className="!px-1 text-xs font-bold uppercase tracking-widest">Recent tasks</SidebarGroupLabel><SidebarMenu>{others.map(renderConversation)}{conversations.length === 0 ? <SidebarMenuItem><View className="px-sp-1 py-sp-2">{hydrating ? <ActivityIndicator color={theme.textSecondary} /> : <Text className="font-sans text-sm text-muted-foreground dark:text-muted-foreground-dark">No tasks yet. Start your first agent task.</Text>}</View></SidebarMenuItem> : null}</SidebarMenu></SidebarGroup>
      </SidebarContent>
      <SidebarFooter><View className="gap-sp-2 border-t border-border pt-sp-3 dark:border-border-dark"><View className="flex-row items-center gap-sp-2 rounded-xl bg-muted p-sp-2 dark:bg-muted-dark"><View className="h-2 w-2 rounded-full bg-green-500" /><View className="flex-1"><Text className="font-sans text-xs font-semibold text-foreground dark:text-foreground-dark">Local-first runtime</Text><Text className="font-sans text-[10px] text-muted-foreground dark:text-muted-foreground-dark">On-device models ready</Text></View></View><SidebarClose asChild><SidebarMenuButton isActive={pathname.startsWith("/settings")} leftIcon={<Settings2 color={theme.text} size={17} />} onPress={() => go("/settings")}>Settings</SidebarMenuButton></SidebarClose></View></SidebarFooter>
    </Sidebar>
    <Modal dismissible={!renaming} onOpenChange={(open) => { if (!open && !renaming) { setRenameTarget(null); setRenameError(null); } }} open={renameTarget !== null}><ModalContent><ModalHeader><ModalTitle>Rename task</ModalTitle><ModalDescription>Give this task a clear name so it is easy to find later.</ModalDescription></ModalHeader><ModalBody><Input accessibilityLabel="Task title" autoFocus maxLength={80} onChangeText={setRenameTitle} onSubmitEditing={submitRename} returnKeyType="done" selectTextOnFocus value={renameTitle} />{renameError ? <Text className="font-sans text-sm text-destructive dark:text-destructive-dark">{renameError}</Text> : null}</ModalBody><ModalFooter><Button disabled={renaming} onPress={() => setRenameTarget(null)} size="sm" variant="ghost">Cancel</Button><Button disabled={!renameTitle.trim()} loading={renaming} onPress={submitRename} size="sm">Save</Button></ModalFooter></ModalContent></Modal>
  </>;
}

function ChatOptions({ color, conversationId, onRename, pinned, pinnedCount }: { color: string; conversationId: string; onRename: () => void; pinned: boolean; pinnedCount: number }) {
  const { deleteConversation, setConversationPinned } = useChat();
  const theme = useTheme();
  return <DropdownMenu><DropdownMenuTrigger><Pressable hitSlop={8}><EllipsisVertical size={18} color={color} /></Pressable></DropdownMenuTrigger><DropdownMenuContent width={190}><DropdownMenuItem onPress={onRename}><View className="flex-row items-center gap-sp-2"><Pencil color={theme.text} size={16} /><Text>Rename</Text></View></DropdownMenuItem><DropdownMenuItem disabled={!pinned && pinnedCount >= 3} onPress={() => setConversationPinned(conversationId, !pinned).catch(console.error)}><View className="flex-row items-center gap-sp-2">{pinned ? <PinOff color={theme.text} size={16} /> : <Pin color={theme.text} size={16} />}<Text>{pinned ? "Unpin" : pinnedCount >= 3 ? "Pin limit reached" : "Pin"}</Text></View></DropdownMenuItem><DropdownMenuItem onPress={() => deleteConversation(conversationId).catch(console.error)}><View className="flex-row items-center gap-sp-2"><Trash2 color={theme.destructive} size={16} /><Text className="text-destructive">Delete</Text></View></DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
}
