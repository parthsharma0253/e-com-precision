import React, { useState } from 'react';
import { Terminal, ShieldAlert, ChevronUp, ChevronDown, CheckCircle2, RefreshCw, Layers } from 'lucide-react';
import { ApiLog } from '../types';

interface ApiConsoleProps {
  logs: ApiLog[];
  onClearLogs: () => void;
  isMockMode: boolean;
  onHelloCheck: () => void;
}

export default function ApiConsole({
  logs,
  onClearLogs,
  isMockMode,
  onHelloCheck
}: ApiConsoleProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeLogId, setActiveLogId] = useState<string | null>(null);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950 text-slate-300 border-t border-slate-800 font-mono shadow-2xl transition-all duration-300 flex flex-col" style={{ height: isOpen ? '290px' : '45px' }} id="api-console">
      
      {/* Console Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="bg-slate-900 px-4 h-11 flex items-center justify-between border-b border-slate-800 cursor-pointer select-none"
        id="api-console-header"
      >
        <div className="flex items-center gap-2.5 text-xs font-semibold">
          <Terminal className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-white tracking-wider text-[11px] uppercase">Spring Boot Live API Inspector</span>
          <span className="text-[10px] text-slate-500 hidden md:inline">| Logs requests & responses in real-time</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {/* Quick "GET /hello" trigger to test basic greeting endpoint */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onHelloCheck();
            }}
            className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] px-2.5 py-1 rounded-md border border-indigo-500/30 font-semibold cursor-pointer transition flex items-center gap-1"
            title="Triggers GET /hello REST request"
          >
            <RefreshCw className="h-3 w-3 text-indigo-400" /> TEST GREETING (GET /hello)
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClearLogs();
            }}
            className="text-slate-400 hover:text-white text-[10px] font-bold uppercase underline cursor-pointer"
          >
            Clear
          </button>

          {isOpen ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronUp className="h-4 w-4 text-slate-400" />}
        </div>
      </div>

      {/* Console content layout */}
      {isOpen && (
        <div className="flex-1 flex overflow-hidden text-xs">
          
          {/* Left panel: list of log entries */}
          <div className="w-1/3 border-r border-slate-800 overflow-y-auto divide-y divide-slate-900 bg-slate-950/80">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-slate-600 text-[11px]">
                No API activity logged yet.<br />Perform operations like searching products, checkout, editing or adding items to record HTTP packets.
              </div>
            ) : (
              logs.map((log) => {
                const isSelected = activeLogId === log.id || (!activeLogId && logs[0].id === log.id);
                const isSuccess = log.responseStatus >= 200 && log.responseStatus < 300;
                
                // Select log on click
                const handleSelect = () => {
                  setActiveLogId(log.id);
                };

                return (
                  <div
                    key={log.id}
                    onClick={handleSelect}
                    className={`p-3 cursor-pointer transition duration-150 flex flex-col gap-1 ${
                      isSelected ? 'bg-slate-800/60 border-l-2 border-indigo-500' : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded leading-none ${
                        log.method === 'GET' ? 'bg-blue-900/30 text-blue-300' :
                        log.method === 'POST' ? 'bg-emerald-900/30 text-emerald-300' :
                        log.method === 'PUT' ? 'bg-amber-900/30 text-amber-300' :
                        'bg-rose-900/30 text-rose-300'
                      }`}>
                        {log.method}
                      </span>
                      <span className="text-[9px] text-slate-500">{log.timestamp}</span>
                    </div>
                    <div className="text-slate-300 text-[10px] truncate max-w-[200px] font-mono mt-1">
                      {log.url}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[9px]">
                      <span className={isSuccess ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        HTTP {log.responseStatus}
                      </span>
                      <span className="text-slate-600">
                        {log.isMock ? 'SIMULATOR' : 'SPRING'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right panel: precise log payload details */}
          <div className="flex-1 bg-slate-950 p-4 overflow-y-auto" id="log-inspector-payload">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                <Layers className="h-10 w-10 text-slate-700 mb-2 stroke-[1.2]" />
                <span>Select an HTTP transmission packet to inspect</span>
              </div>
            ) : (
              (() => {
                const activeLog = logs.find(l => l.id === activeLogId) || logs[0];
                if (!activeLog) return null;

                const curlCommand = `curl -X ${activeLog.method} "${activeLog.url}" \\\n  -H "Content-Type: application/json" ${
                  activeLog.requestBody ? `\\\n  -d '${JSON.stringify(activeLog.requestBody, null, 2)}'` : ''
                }`;

                return (
                  <div className="space-y-4 animate-fadeIn">
                    
                    {/* CURL Header block */}
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">Equivalent cURL Command</div>
                      <pre className="bg-slate-900 p-2.5 rounded-lg text-[10px] text-slate-300 overflow-x-auto whitespace-pre-wrap border border-slate-850 leading-relaxed max-h-32 shadow-inner">
                        {curlCommand}
                      </pre>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Request Payload JSON */}
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">Request Body JSON</div>
                        <pre className="bg-slate-900/50 p-2.5 rounded-lg text-[10px] text-slate-300 overflow-x-auto border border-slate-850 max-h-32 shadow-inner">
                          {activeLog.requestBody ? JSON.stringify(activeLog.requestBody, null, 2) : 'No request payload (empty body)'}
                        </pre>
                      </div>

                      {/* Response Payload JSON */}
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">Response JSON</div>
                        <pre className="bg-slate-900/50 p-2.5 rounded-lg text-[10px] text-slate-300 overflow-x-auto border border-slate-850 max-h-32 shadow-inner">
                          {JSON.stringify(activeLog.responseBody, null, 2)}
                        </pre>
                      </div>
                    </div>

                  </div>
                );
              })()
            )}
          </div>

        </div>
      )}

    </div>
  );
}
