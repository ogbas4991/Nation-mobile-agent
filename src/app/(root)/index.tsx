import { ArrowUp, Bot, Brain, FolderOpen, Plus, Sparkles, Wrench } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { useChat } from "@/hooks/use-chat";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/core/utils";

const QUICK_ACTIONS = [
  { label: "Build", icon: Wrench, prompt: "Build this feature: " },
  { label: "Plan", icon: Brain, prompt: "Create a plan for: " },
  { label: "Files", icon: FolderOpen, prompt: "Help me work with my files: " },
];

export default function AgentHome() {
  const theme = useTheme();
  const { currentConversation, createConversation, sendMessage } = useChat();
  const [prompt, setPrompt] = useState("");

  const startTask = async () => {
    const value = prompt.trim();
    if (!value) return;
    setPrompt("");
    if (!currentConversation) await createConversation();
    await sendMessage(value);
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <View className="flex-row items-center justify-between border-b border-border px-5 py-4 dark:border-border-dark">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary"><Sparkles color={theme.background} size={20} /></View>
          <View><Text className="font-sans text-base font-bold text-foreground dark:text-foreground-dark">PAPYLO J AGENT</Text><Text className="font-sans text-xs text-muted-foreground dark:text-muted-foreground-dark">Local AI workspace</Text></View>
        </View>
        <Pressable accessibilityLabel="New task" className="h-10 w-10 items-center justify-center rounded-xl bg-muted dark:bg-muted-dark" onPress={() => createConversation()}><Plus color={theme.text} size={20} /></Pressable>
      </View>
      <ScrollView contentContainerClassName="flex-grow px-5 pb-8 pt-12" keyboardShouldPersistTaps="handled">
        <View className="mb-8"><View className="mb-5 h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 dark:bg-primary/20"><Bot color={theme.primary} size={30} /></View><Text className="font-sans text-4xl font-bold leading-tight text-foreground dark:text-foreground-dark">What are we building today?</Text><Text className="mt-3 font-sans text-base leading-6 text-muted-foreground dark:text-muted-foreground-dark">Describe a goal. PAPYLO can plan, inspect files, use tools, and execute the task with you.</Text></View>
        <View className="mb-5 flex-row flex-wrap gap-3">{QUICK_ACTIONS.map(({ label, icon: Icon, prompt: actionPrompt }) => <Pressable key={label} onPress={() => setPrompt(actionPrompt)} className="flex-row items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 dark:border-border-dark dark:bg-card-dark"><Icon color={theme.primary} size={17} /><Text className="font-sans text-sm font-semibold text-foreground dark:text-foreground-dark">{label}</Text></Pressable>)}</View>
        <View className="rounded-3xl border border-border bg-card p-3 shadow-sm dark:border-border-dark dark:bg-card-dark">
          <TextInput accessibilityLabel="Agent task" multiline value={prompt} onChangeText={setPrompt} placeholder="Tell PAPYLO what you want to accomplish…" placeholderTextColor={theme.textSecondary} className="min-h-28 rounded-2xl bg-muted px-4 py-3 font-sans text-base text-foreground dark:bg-muted-dark dark:text-foreground-dark" />
          <View className="mt-3 flex-row items-center justify-between px-1"><View className="flex-row items-center gap-2"><View className="h-2 w-2 rounded-full bg-green-500" /><Text className="font-sans text-xs font-semibold text-muted-foreground dark:text-muted-foreground-dark">Local runtime ready</Text></View><Pressable disabled={!prompt.trim()} onPress={startTask} className={cn("h-11 w-11 items-center justify-center rounded-2xl", prompt.trim() ? "bg-primary" : "bg-muted dark:bg-muted-dark")}><ArrowUp color={prompt.trim() ? theme.background : theme.textSecondary} size={20} /></Pressable></View>
        </View>
        <View className="mt-8 flex-row gap-3"><View className="flex-1 rounded-2xl bg-muted p-4 dark:bg-muted-dark"><Text className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-muted-foreground-dark">Runtime</Text><Text className="mt-2 font-sans text-base font-semibold text-foreground dark:text-foreground-dark">On-device</Text></View><View className="flex-1 rounded-2xl bg-muted p-4 dark:bg-muted-dark"><Text className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-muted-foreground-dark">Workspace</Text><Text className="mt-2 font-sans text-base font-semibold text-foreground dark:text-foreground-dark">Ready</Text></View></View>
      </ScrollView>
    </View>
  );
}
