import React from 'react';
import { HelpCircle, PlayCircle, Settings, PlusCircle, MinusCircle, CheckSquare, Layers } from 'lucide-react';

export default function DevDocs() {
  return (
    <div className="max-w-5xl mx-auto pb-16 animate-fadeIn font-sans text-slate-700" id="dev-docs-container">
      
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-4 mb-8">
        <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
          📖 Spring Boot & React Integration Guide
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Everything you need to run, configure, and customize your full-stack application.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Step 1: How to Run */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-950 mb-4 flex items-center gap-2">
            <PlayCircle className="h-4 w-4 text-indigo-600" />
            1. How to Run the React Frontend with your Spring Boot Server
          </h3>
          
          <div className="space-y-4 text-xs leading-relaxed text-slate-600">
            <p>
              By default, this frontend can run **completely serverless/offline** using our pre-built Mock Simulator so you can preview actions instantly. To connect it to your live local Spring Boot server, follow these steps:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="font-bold text-slate-900 block mb-1">Step A: Enable CORS in Spring Boot</span>
                <p className="text-slate-500 mb-3 text-[11px]">
                  Browsers block requests from port 3000 to port 8081 unless your Spring controllers explicitly allow Cross-Origin requests. Add the <code className="bg-slate-250 text-slate-700 px-1 rounded font-mono text-[10px]">@CrossOrigin</code> annotation to your controller classes:
                </p>
                <pre className="bg-slate-950 text-indigo-300 p-2.5 rounded-lg font-mono text-[10px] overflow-x-auto border border-slate-900 shadow-inner">
{`@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class ProductController {
    // ...
}`}
                </pre>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="font-bold text-slate-900 block mb-1">Step B: Run Frontend Locally</span>
                <p className="text-slate-500 mb-3 text-[11px]">
                  Download the ZIP package of this applet. In your local terminal, install the dependencies and start the local Node dev server:
                </p>
                <pre className="bg-slate-950 text-indigo-300 p-2.5 rounded-lg font-mono text-[10px] overflow-x-auto border border-slate-900 shadow-inner">
{`# 1. Install dependencies
npm install

# 2. Run local server
npm run dev`}
                </pre>
                <p className="text-slate-500 mt-2 text-[10px]">
                  Open <code className="bg-slate-200 text-slate-700 px-1 rounded font-mono text-[10px]">http://localhost:3000</code> in your browser to inspect the application.
                </p>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-800 flex items-start gap-2.5 shadow-sm">
              <Settings className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-950 block text-[11px]">Connecting them in the Browser:</span>
                <span className="text-[11px]">
                  Toggle the switch at the very top of this page to <strong>"Live Spring Boot"</strong> and set your local address (e.g. <code className="bg-indigo-100 px-1 rounded font-mono text-[10px]">http://localhost:8081</code>). All list/add/checkout clicks will now make real REST calls!
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: How to Add new endpoints */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-950 mb-4 flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-indigo-600" />
            2. How to Add a New API Endpoint
          </h3>
          
          <div className="space-y-4 text-xs leading-relaxed text-slate-600">
            <p>
              To add support for a new endpoint in your Spring Boot controller (e.g. <code className="bg-slate-100 text-slate-800 px-1 rounded font-mono text-[10px]">GET /api/product/{"{id}"}/reviews</code>), follow these two simple steps:
            </p>

            <div className="space-y-3 pl-2">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Step A: Define the Types (Typescript)</span>
                <p className="text-slate-500 mb-2">
                  Open your <code className="bg-slate-100 px-1 rounded font-mono text-[10px]">/src/types.ts</code> file and append the definition representing the JSON structure returned by your Spring Boot endpoint:
                </p>
                <pre className="bg-slate-950 text-indigo-300 p-2.5 rounded-lg font-mono text-[10px] overflow-x-auto border border-slate-900 shadow-inner">
{`export interface ProductReview {
  reviewId: number;
  reviewerName: string;
  rating: number; // e.g. 1-5
  comment: string;
}`}
                </pre>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Step B: Add the Fetch Function (React)</span>
                <p className="text-slate-500 mb-2">
                  In your main state manager inside <code className="bg-slate-100 px-1 rounded font-mono text-[10px]">/src/App.tsx</code>, write a standard JavaScript `fetch` handler to send HTTP requests to your Spring Boot server:
                </p>
                <pre className="bg-slate-950 text-indigo-300 p-2.5 rounded-lg font-mono text-[10px] overflow-x-auto border border-slate-900 shadow-inner">
{`const fetchProductReviews = async (productId: number) => {
  try {
    const url = \`\${apiBaseUrl}/api/product/\${productId}/reviews\`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not fetch reviews");
    const data: ProductReview[] = await response.json();
    return data;
  } catch (err) {
    console.error("Error communicating with Spring Boot:", err);
  }
};`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: How to Remove endpoints */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-950 mb-4 flex items-center gap-2">
            <MinusCircle className="h-4 w-4 text-rose-500" />
            3. How to Remove an Endpoint
          </h3>
          
          <div className="space-y-4 text-xs leading-relaxed text-slate-600">
            <p>
              If you delete an endpoint from your Spring Boot controller (for example, removing <code className="bg-slate-100 text-slate-800 px-1 rounded font-mono text-[10px]">GET /api/product/{"{productId}"}/image</code>):
            </p>

            <ul className="list-disc pl-5 space-y-2 text-slate-500">
              <li>
                <strong className="text-slate-950">Remove local React references:</strong> Search your React codebase (e.g. inside <code className="bg-slate-100 text-slate-900 px-1 rounded font-mono text-[10px]">App.tsx</code>) for any fetches referencing that specific URL path. Delete those blocks or replace them with direct local variables.
              </li>
              <li>
                <strong className="text-slate-950">Clean up types:</strong> Remove any redundant keys from `types.ts` that were only used by that removed endpoint, preventing TypeScript compilation warnings.
              </li>
              <li>
                <strong className="text-slate-950">Verify compiling builds:</strong> Run <code className="bg-slate-100 text-slate-900 px-1 rounded font-mono text-[10px]">npm run build</code> or look at the AI Studio status panel to confirm the absence of broken imports or type mismatches.
              </li>
            </ul>
          </div>
        </section>

        {/* Step 4: UI/UX Guide */}
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-950 mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-850" />
            4. Layout Architecture (UX Design Style Guide)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            This workspace implements a **Desktop-First Precision** layout focusing on typographic hierarchy, clean margins, and elegant high-contrast palette (slate, indigo, and soft whites). This makes the app look professional out of the box.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 border border-slate-150 rounded-lg shadow-sm">
              <span className="block font-mono text-[10px] text-slate-400 uppercase">Typography</span>
              <span className="font-sans font-bold text-slate-950 text-sm block mt-1">Inter & Space Grotesk</span>
            </div>
            <div className="bg-white p-4 border border-slate-150 rounded-lg shadow-sm">
              <span className="block font-mono text-[10px] text-slate-400 uppercase">Primary Palette</span>
              <span className="font-mono font-bold text-indigo-600 text-xs block mt-1">Slate & Indigo Accent</span>
            </div>
            <div className="bg-white p-4 border border-slate-150 rounded-lg shadow-sm">
              <span className="block font-mono text-[10px] text-slate-400 uppercase">Icons Library</span>
              <span className="font-mono font-bold text-slate-950 text-xs block mt-1">lucide-react</span>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
