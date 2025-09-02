## **Detailed Implementation Spec**

### **Phase 1: Foundation Setup**

#### **1.1 Project Setup**

```bash
npx create-next-app@latest brand-response-platform --typescript --tailwind --eslint
cd brand-response-platform
npm install @types/node
```

#### **1.2 Environment Setup**

Create `.env.local`:

```
ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### **1.3 Basic File Structure**

Create these files (I'll provide code for each):

- `pages/index.tsx` (landing page)
- `pages/demo/index.tsx` (demo entry)
- `components/BusinessContextForm.tsx`
- `components/SampleDataPreview.tsx`
- `components/VariableSelection.tsx`
- `components/DataPreview.tsx`
- `components/InsightsGenerator.tsx`
- `components/ReportViewer.tsx`
- `lib/api.ts`
- `lib/data.ts`
- `public/data/sample-enriched.json`

---

### **Phase 2: Component Implementation Order**

#### **Step 1: Sample Data Preview Component**

**File:** `components/SampleDataPreview.tsx` **Purpose:** Shows sample customer data upfront for demo narrative **Features:**

- Display first 10 rows of sample data
- "Load Sample Data" button that shows loading state
- Smooth transition to business context form

#### **Step 2: Business Context Form**

**File:** `components/BusinessContextForm.tsx` **Purpose:** Capture business information for AI analysis **Features:**

- Industry dropdown, business model selection
- Text areas for positioning/customers
- Form validation and submit handling

#### **Step 3: Variable Selection Display**

**File:** `components/VariableSelection.tsx` **Purpose:** Show AI-selected variables with rationale **Features:**

- API call to generate variable selection
- Professional table display
- Loading states

#### **Step 4: Data Preview**

**File:** `components/DataPreview.tsx` **Purpose:** Show what enriched data looks like **Features:**

- Display enhanced sample data
- Highlight new columns/insights

#### **Step 5: Insights Generator & Report**

**Files:** `components/InsightsGenerator.tsx` + `components/ReportViewer.tsx` **Purpose:** Generate and display professional report **Features:**

- AI insights generation
- Markdown rendering
- Professional report styling

---

### **Phase 3: Implementation Checklist**

**Foundation:**

- [x] Project setup complete
- [x] File structure created
- [x] Environment variables configured

**Components (in order):**

- [x] SampleDataPreview working
- [x] BusinessContextForm functional
- [X] VariableSelection displaying
- [X] DataPreview showing enriched data
- [X] InsightsGenerator calling API
- [X] ReportViewer rendering markdown

**Polish:**

- [ ] Navigation between steps
- [ ] Loading states implemented
- [ ] Mobile responsive design
- [ ] Error handling added

**Deployment:**

- [ ] Vercel deployment working
- [X] Environment variables set in production

---

### **Working Together Process**

1. **I provide complete code** for each file
2. **You implement** into the file structure
3. **Test each component** individually before moving to next
4. **Check off items** as we complete them
5. **Debug together** if issues arise