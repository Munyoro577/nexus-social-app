import ChatConversation from './ChatConversation';

export function generateStaticParams() {
  return [{ chatId: 'chat1' }, { chatId: 'chat2' }, { chatId: 'chat3' }, { chatId: 'chat4' }];
}

export default function ChatPage({ params }: { params: { chatId: string } }) {
  return <ChatConversation chatId={params.chatId} />;
}
