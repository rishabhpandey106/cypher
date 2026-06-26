import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Loader2, Plus, Copy, Trash2 } from 'lucide-react';
import { Input } from './ui/input';

export default function PollsDashboard({ username }: { username: string }) {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '']);
  const [openEmbedMenu, setOpenEmbedMenu] = useState<string | null>(null);
  const { toast } = useToast();

  const [baseUrl, setBaseUrl] = useState('https://cypher.itsrishabh.tech');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const res = await axios.get('/api/polls/getpolls');
      setPolls(res.data.polls);
    } catch (error) {
      toast({ title: 'Error fetching polls', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const togglePollStatus = async (pollId: string) => {
    try {
      setPolls(polls.map(p => p._id === pollId ? { ...p, isActive: !p.isActive } : p));
      const res = await axios.patch(`/api/polls/${pollId}/toggle`);
      toast({
        title: res.data.message,
        className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black",
      });
    } catch (error) {
      toast({ title: 'Error toggling status', variant: 'destructive' });
      fetchPolls(); // revert
    }
  };

  const copyPollLink = (pollId: string) => {
    navigator.clipboard.writeText(`${baseUrl}/poll/${pollId}`);
    toast({
      title: "Link Copied!",
      description: "Share this link with your audience.",
      className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-yellow-300 text-black",
    });
  };

  const copyHtmlEmbed = (poll: any) => {
    const embedCode = `<iframe id="cypher-poll-${poll._id}" src="${baseUrl}/embed/poll/${poll._id}" width="100%" height="400" frameborder="0" scrolling="no"></iframe><script>window.addEventListener("message",function(e){if(e.data&&e.data.type==='cypher-poll-resize'&&e.data.pollId==='${poll._id}'){const el=document.getElementById('cypher-poll-${poll._id}');if(el)el.style.height=e.data.height+'px'}});</script>`;
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "HTML Embed Copied!",
      description: "Paste this code on your website.",
      className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-blue-300 text-black",
    });
  };

  const copyReactEmbed = (poll: any) => {
    const reactCode = `import { useEffect } from 'react';\n\nexport default function CypherPoll() {\n  useEffect(() => {\n    const handleMessage = (e) => {\n      if (e.data && e.data.type === 'cypher-poll-resize' && e.data.pollId === '${poll._id}') {\n        const iframe = document.getElementById('cypher-poll-${poll._id}');\n        if (iframe) iframe.style.height = e.data.height + 'px';\n      }\n    };\n    window.addEventListener('message', handleMessage);\n    return () => window.removeEventListener('message', handleMessage);\n  }, []);\n\n  return (\n    <iframe \n      id="cypher-poll-${poll._id}" \n      src="${baseUrl}/embed/poll/${poll._id}" \n      width="100%" \n      height="400" \n      frameBorder="0" \n      scrolling="no"\n    />\n  );\n}`;
    navigator.clipboard.writeText(reactCode);
    toast({
      title: "React Component Copied!",
      description: "Paste this code into a new React component file.",
      className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-purple-300 text-black",
    });
  };

  const handleCreatePoll = async () => {
    if (!newQuestion || newOptions.some(o => !o)) {
      toast({ title: 'Fill all fields', variant: 'destructive' });
      return;
    }
    setCreating(true);
    try {
      await axios.post('/api/polls/create', { question: newQuestion, options: newOptions });
      toast({ title: 'Poll created!' });
      setNewQuestion('');
      setNewOptions(['', '']);
      fetchPolls();
    } catch (error) {
      toast({ title: 'Error creating poll', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };


  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="space-y-8">
      {/* Create Poll Card */}
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-black uppercase mb-6">Create New Poll</h2>
        <div className="space-y-4">
          <Input 
            placeholder="Poll Question?" 
            value={newQuestion} 
            onChange={e => setNewQuestion(e.target.value)}
            className="border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 font-bold text-lg"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newOptions.map((opt, i) => (
              <Input 
                key={i}
                placeholder={`Option ${i + 1}`} 
                value={opt} 
                onChange={e => {
                  const newOpts = [...newOptions];
                  newOpts[i] = e.target.value;
                  setNewOptions(newOpts);
                }}
                className="border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 font-bold"
              />
            ))}
          </div>
          {newOptions.length < 4 && (
            <Button onClick={() => setNewOptions([...newOptions, ''])} variant="outline" className="border-4 border-black rounded-none font-black uppercase">
              + Add Option
            </Button>
          )}
          <Button 
            disabled={creating}
            onClick={handleCreatePoll}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase py-6"
          >
            {creating ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />} Create Cypher Poll
          </Button>
        </div>
      </div>

      {/* Polls List */}
      <h2 className="text-3xl font-black uppercase text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">Your Active Polls</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.map(poll => (
          <div key={poll._id} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
            <div className="flex justify-between items-start mb-4 gap-4">
              <h3 className="text-2xl font-black uppercase">{poll.question}</h3>
              <Button 
                onClick={() => togglePollStatus(poll._id)}
                className={`border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase whitespace-nowrap ${poll.isActive ? 'bg-green-400 text-black hover:bg-green-500' : 'bg-red-500 text-white hover:bg-red-600'}`}
              >
                {poll.isActive ? 'ACTIVE' : 'CLOSED'}
              </Button>
            </div>
            <div className="space-y-2 mb-6 flex-grow">
              {poll.options.map((opt: any) => (
                <div key={opt.id} className="flex justify-between bg-gray-100 border-2 border-black p-2 font-bold">
                  <span>{opt.id}. {opt.text}</span>
                  <span className="text-pink-600">⚡ {opt.boostedVotes + opt.freeVotes}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t-4 border-black pt-4">
              <span className="font-black text-green-600">₹{poll.totalRevenue.toFixed(2)} Earned</span>
              <div className="flex gap-2">
                <Button onClick={() => copyPollLink(poll._id)} className="bg-yellow-400 text-black hover:bg-yellow-500 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase">
                  <Copy className="mr-2 h-4 w-4" /> Share
                </Button>
                <div className="relative">
                  <Button 
                    onClick={() => setOpenEmbedMenu(openEmbedMenu === poll._id ? null : poll._id)} 
                    className="bg-blue-400 text-black hover:bg-blue-500 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-xs px-2 sm:px-4"
                  >
                    <Copy className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Embed
                  </Button>
                  
                  {openEmbedMenu === poll._id && (
                    <div className="absolute bottom-full right-0 mb-2 w-32 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col z-10">
                      <button 
                        onClick={() => { copyHtmlEmbed(poll); setOpenEmbedMenu(null); }}
                        className="text-left px-4 py-2 font-black text-xs uppercase hover:bg-blue-400 border-b-4 border-black transition-colors"
                      >
                        HTML
                      </button>
                      <button 
                        onClick={() => { copyReactEmbed(poll); setOpenEmbedMenu(null); }}
                        className="text-left px-4 py-2 font-black text-xs uppercase hover:bg-purple-400 transition-colors"
                      >
                        React
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
