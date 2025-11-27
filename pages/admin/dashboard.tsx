import { useEffect, useState } from "react";
import { authApi } from '../../lib/authApi';

export default function AdminDashboard() {
  const [exam, setExam] = useState<"JEE" | "NEET">("JEE");
  const [name, setName] = useState("");
  const [questionsCount, setQuestionsCount] = useState(20);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [date, setDate] = useState("");
  const [icon, setIcon] = useState("");
  const [source, setSource] = useState("");
  const [official, setOfficial] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Manage Questions state
  const [papers, setPapers] = useState<any[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [subject, setSubject] = useState<
    "Physics" | "Chemistry" | "Mathematics"
  >("Physics");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([{ text: "", image: "" }, { text: "", image: "" }, { text: "", image: "" }, { text: "", image: "" }]);
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [qMessage, setQMessage] = useState<string | null>(null);
  const [qError, setQError] = useState<string | null>(null);
  const [questionImage, setQuestionImage] = useState<string | ArrayBuffer | null>(null);
  // questions for selected paper and edit state
  const [paperQuestions, setPaperQuestions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editOptions, setEditOptions] = useState([{ text: "", image: "" }, { text: "", image: "" }, { text: "", image: "" }, { text: "", image: "" }]);
  const [editCorrectIndex, setEditCorrectIndex] = useState<number>(0);
  const [editSubject, setEditSubject] = useState<
    "Physics" | "Chemistry" | "Mathematics" | ""
  >("");
  const [editQuestionImage, setEditQuestionImage] = useState<string | ArrayBuffer | null>(null);
  // UI mode: 'papers' or 'questions'
  const [mode, setMode] = useState<"papers" | "questions">("papers");
  const [showCreatePaper, setShowCreatePaper] = useState(true);
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);

  useEffect(() => {
    // set default date to today
    const today = new Date().toISOString().slice(0, 10);
    setDate(today);
    fetchPapers();
  }, []);

  function startEditPaper(p: any) {
    setMode("papers");
    setEditingPaperId(String(p._id || ""));
    setShowCreatePaper(true);
    setExam(p.category === "NEET" ? "NEET" : "JEE");
    setName(p.title || "");
    setQuestionsCount(p.totalQuestions || 20);
    setDurationMinutes(p.durationMinutes || 30);
    setDate(
      p.date
        ? new Date(p.date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10)
    );
    setIcon(p.icon || "");
    setSource(p.source || "");
    setOfficial(!!p.official);
  }

  function cancelEditPaper() {
    setEditingPaperId(null);
    setShowCreatePaper(false);
    // reset fields
    setExam("JEE");
    setName("");
    setQuestionsCount(20);
    setDurationMinutes(30);
    const today = new Date().toISOString().slice(0, 10);
    setDate(today);
    setIcon("");
    setSource("");
    setOfficial(false);
  }

  useEffect(() => {
    if (!selectedPaper) {
      setPaperQuestions([]);
      return;
    }
    fetchPaperDetails(selectedPaper);
  }, [selectedPaper]);

  async function fetchPaperDetails(paperId: string) {
    try {
      const data = await authApi({ url: `/api/papers/${paperId}` });
      if (data?.paper) {
        setPaperQuestions(data.paper.questions || []);
      }
    } catch (err) {
      // ignore
    }
  }

  async function fetchPapers() {
    try {
      const data = await authApi({ url: "/api/papers?category=all&limit=200" });
      setPapers(data.papers || []);
      if ((data.papers || []).length > 0)
        setSelectedPaper((data.papers || [])[0]._id);
    } catch (err) {
      // ignore
    }
  }

  async function createPaper(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const adminPhone =
      typeof window !== "undefined" ? localStorage.getItem("userPhone") : null;
    if (!adminPhone) {
      setError(
        "Admin phone not found in localStorage. Make sure you are logged in as admin."
      );
      return;
    }

    const body = {
      exam,
      name,
      questionsCount,
      durationMinutes,
      date,
      icon,
      source,
      official,
      adminPhone,
    };

    try {
      if (editingPaperId) {
        // update existing paper
        const data = await authApi({
          url: `/api/papers/${editingPaperId}`,
          method: "PUT",
          data: { ...body, title: name, adminPhone },
        });
        if (data?.ok) {
          setMessage("Paper updated successfully");
          cancelEditPaper();
          fetchPapers();
        } else {
          setError(data?.error || "Failed to update");
        }
      } else {
        const data = await authApi({
          url: "/api/papers",
          method: "POST",
          data: body,
        });
        if (data?.ok) {
          setMessage("Paper created successfully");
          setName("");
          fetchPapers();
        } else {
          setError(data?.error || "Failed to create");
        }
      }
    } catch (err) {
      setError("Network error");
    }
  }

  async function addQuestion(e: React.FormEvent) {
    e.preventDefault();
    setQError(null);
    setQMessage(null);

    if (!selectedPaper) {
      setQError("Select a paper first");
      return;
    }

    // At least one field in each option
    if (!questionText && !questionImage) {
      setQError("Enter question text or select an image.");
      return;
    }
    if (options.some((o) => !o.text && !o.image)) {
      setQError("Each option must have text or image.");
      return;
    }

    const adminPhone =
      typeof window !== "undefined" ? localStorage.getItem("userPhone") : null;
    if (!adminPhone) {
      setQError("Admin phone not found in localStorage");
      return;
    }

    const body = {
      text: questionText,
      image: questionImage, // <-- Ensure image is sent
      options,
      correctIndex,
      subject,
      adminPhone,
    };
 
    try {
      const data = await authApi({
        url: `/api/papers/${selectedPaper}/questions`,
        method: "POST",
        data: body,
      });
      if (data?.ok) {
        setQMessage("Question added");
        setQuestionText("");
        setQuestionImage("");
        setOptions([
          { text: "", image: "" },
          { text: "", image: "" },
          { text: "", image: "" },
          { text: "", image: "" }
        ]);
        setCorrectIndex(0);
        // refresh question list
        if (selectedPaper) fetchPaperDetails(selectedPaper);
      } else {
        setQError(data?.error || "Failed to add question");
      }
    } catch (err) {
      setQError("Network error");
    }
  }

  function startEdit(q: any) {
    setEditingId(String(q._id || ""));
    setEditQuestionText(q.text || "");
    setEditOptions(q.options ? [...q.options] : [{ text: "", image: "" }, { text: "", image: "" }, { text: "", image: "" }, { text: "", image: "" }]);
    setEditCorrectIndex(
      typeof q.correctIndex === "number" ? q.correctIndex : 0
    );
    setEditSubject((q.subject as any) || "");
    setEditQuestionImage(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditQuestionText("");
    setEditOptions([{ text: "", image: "" }, { text: "", image: "" }, { text: "", image: "" }, { text: "", image: "" }]);
    setEditCorrectIndex(0);
    setEditSubject("");
    setEditQuestionImage(null);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPaper || !editingId) return;
    const adminPhone =
      typeof window !== "undefined" ? localStorage.getItem("userPhone") : null;
    if (!adminPhone) {
      setQError("Admin phone not found in localStorage");
      return;
    }
    try {
      const data = await authApi({
        url: `/api/papers/${selectedPaper}/questions/${editingId}`,
        method: "PUT",
        data: {
          text: editQuestionText,
          image: editQuestionImage,
          options: editOptions, 
          correctIndex: editCorrectIndex,
          subject: editSubject,
          adminPhone,
        },
      });
      if (data?.ok) {
        setQMessage("Question updated");
        cancelEdit();
        fetchPaperDetails(selectedPaper);
      } else {
        setQError(data?.error || "Failed to update");
      }
    } catch (err) {
      setQError("Network error");
    }
  }

  async function deleteQuestion(qid: string) {
    if (!selectedPaper) return;
    const adminPhone =
      typeof window !== "undefined" ? localStorage.getItem("userPhone") : null;
    if (!adminPhone) {
      setQError("Admin phone not found in localStorage");
      return;
    }
    if (!confirm("Delete this question?")) return;
    try {
      const data = await authApi({
        url: `/api/papers/${selectedPaper}/questions/${qid}`,
        method: "DELETE",
        data: { adminPhone },
      });
      if (data?.ok) {
        setQMessage("Question deleted");
        fetchPaperDetails(selectedPaper);
      } else {
        setQError(data?.error || "Failed to delete");
      }
    } catch (err) {
      setQError("Network error");
    }
  }

  // --- IMAGE UPLOAD HANDLERS ---
  function handleQuestionImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setQuestionImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  function handleOptionImageFile(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const copy = [...options];
        copy[i].image = ev.target?.result as string;
        setOptions(copy);
      };
      reader.readAsDataURL(file);
    }
  }
  function handleEditQuestionImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditQuestionImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  function handleEditOptionImageFile(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const copy = [...editOptions];
        copy[i].image = ev.target?.result as string;
        setEditOptions(copy);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar */}
        <aside className="w-72 bg-white rounded shadow p-4">
          <div className="font-bold mb-4">Admin</div>
          <ul className="space-y-2 text-sm">
            <li className="py-2 px-2 rounded bg-green-50">Create Paper</li>
            <li className="py-2 px-2 rounded">Manage Questions</li>
            <li className="py-2 px-2 rounded">Users</li>
            <li className="py-2 px-2 rounded">Settings</li>
          </ul>
        </aside>

        {/* Main form */}
        <main className="flex-1">
          {/* Tabs: Papers / Questions */}
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              className={`px-4 py-2 rounded ${
                mode === "papers" ? "bg-blue-600 text-white" : "bg-white border"
              }`}
              onClick={() => setMode("papers")}
            >
              Papers
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded ${
                mode === "questions"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
              onClick={() => setMode("questions")}
            >
              Questions
            </button>
          </div>

          {mode === "papers" && (
            <div className="bg-white rounded shadow p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold mb-4">Papers</h2>
                <div className="flex items-center gap-2">
                  <button
                    className="btn-primary px-3 py-2"
                    onClick={() => {
                      setShowCreatePaper((s) => !s);
                      setEditingPaperId(null);
                    }}
                  >
                    {showCreatePaper ? "Hide Add" : "Add Paper"}
                  </button>
                </div>
              </div>

              {showCreatePaper && (
                <form onSubmit={createPaper} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Exam</label>
                      <select
                        value={exam}
                        onChange={(e) => setExam(e.target.value as any)}
                        className="mt-1 block w-full border rounded p-2"
                      >
                        <option value="JEE">JEE</option>
                        <option value="NEET">NEET</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Questions Count
                      </label>
                      <input
                        type="number"
                        value={questionsCount}
                        onChange={(e) =>
                          setQuestionsCount(parseInt(e.target.value || "0"))
                        }
                        className="mt-1 block w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Duration (mins)
                      </label>
                      <input
                        type="number"
                        value={durationMinutes}
                        onChange={(e) =>
                          setDurationMinutes(parseInt(e.target.value || "0"))
                        }
                        className="mt-1 block w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Icon</label>
                      <input
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Source
                      </label>
                      <input
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="official"
                        type="checkbox"
                        checked={official}
                        onChange={(e) => setOfficial(e.target.checked)}
                      />
                      <label htmlFor="official" className="text-sm">
                        Official
                      </label>
                    </div>
                  </div>

                  {message && <div className="text-green-600">{message}</div>}
                  {error && <div className="text-red-600">{error}</div>}

                  <div>
                    <button className="btn-primary px-4 py-2" type="submit">
                      {editingPaperId ? "Update Paper" : "Create Paper"}
                    </button>
                    {editingPaperId && (
                      <button
                        type="button"
                        className="ml-2 px-4 py-2 border rounded"
                        onClick={cancelEditPaper}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Papers List */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">All Papers</h3>
                <div className="space-y-3">
                  {papers.map((p) => (
                    <div
                      key={p._id}
                      className="p-3 border rounded flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-sm text-gray-500">
                          {p.category} — {p.totalQuestions} questions
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 border rounded"
                          onClick={() => startEditPaper(p)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === "questions" && (
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-bold mb-4">Manage Questions</h2>

              <form onSubmit={addQuestion} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Select Paper
                    </label>
                    <select
                      value={selectedPaper || ""}
                      onChange={(e) => setSelectedPaper(e.target.value)}
                      className="mt-1 block w-full border rounded p-2"
                    >
                      {papers.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.title} — {p.exam}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as any)}
                      className="mt-1 block w-full border rounded p-2"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium">
                      Question
                    </label>
                    <textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className="mt-1 block w-full border rounded p-2"
                    />
                    <label className="block text-sm font-medium mt-2">Question Image (optional)</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQuestionImageFile}
                        className="mt-1 block border rounded p-2"
                      />
                      {questionImage && <img src={questionImage as string} alt="Preview" className="h-12" />}
                    </div>
                  </div>

                  {[0, 1, 2, 3].map((i) => (
                    <div key={i}>
                      <label className="block text-sm font-medium">
                        Option {i + 1}
                      </label>
                      <input
                        value={options[i].text}
                        onChange={(e) => {
                          const copy = [...options];
                          copy[i].text = e.target.value;
                          setOptions(copy);
                        }}
                        className="mt-1 block w-full border rounded p-2"
                        placeholder="Option text (optional)"
                      />
                      <label className="block text-xs font-medium mt-1">Option Image (optional)</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleOptionImageFile(i, e)}
                          className="mt-1 block border rounded p-2"
                        />
                        {options[i].image && <img src={options[i].image} alt="Preview" className="h-12" />}
                      </div>
                    </div>
                  ))}

                  <div className="col-span-2">
                    <label className="block text-sm font-medium">
                      Correct Option
                    </label>
                    <div className="flex gap-4 mt-2">
                      {[0, 1, 2, 3].map((i) => (
                        <label
                          key={i}
                          className="inline-flex items-center gap-2"
                        >
                          <input
                            type="radio"
                            name="correct"
                            checked={correctIndex === i}
                            onChange={() => setCorrectIndex(i)}
                          />
                          <span>Option {i + 1}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {qMessage && <div className="text-green-600">{qMessage}</div>}
                {qError && <div className="text-red-600">{qError}</div>}

                <div>
                  <button className="btn-primary px-4 py-2" type="submit">
                    Add Question
                  </button>
                </div>
              </form>

              {/* Questions List & Edit */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Questions ({paperQuestions.length})
                </h3>
                {paperQuestions.length === 0 && (
                  <div className="text-sm text-gray-600">
                    No questions yet for selected paper.
                  </div>
                )}

                <div className="space-y-4 mt-4">
                  {paperQuestions.map((q) => (
                    <div
                      key={String(q._id || Math.random())}
                      className="p-4 border rounded"
                    >
                      {editingId === String(q._id) ? (
                        <form onSubmit={saveEdit} className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium">Question</label>
                            <div className="flex flex-col gap-2">
                              <textarea
                                value={editQuestionText}
                                onChange={(e) => setEditQuestionText(e.target.value)}
                                className="mt-1 block w-full border rounded p-2"
                              />
                              {editQuestionImage && (
                                <img src={editQuestionImage as string} alt="Question Preview" className="h-16" />
                              )}
                              <label className="block text-sm font-medium mt-2">Question Image (optional)</label>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleEditQuestionImageFile}
                                  className="mt-1 block border rounded p-2"
                                />
                              </div>
                            </div>
                          </div>
                          {[0, 1, 2, 3].map((i) => (
                            <div key={i}>
                              <label className="block text-sm font-medium">
                                Option {i + 1}
                              </label>
                              <input
                                value={editOptions[i].text}
                                onChange={(e) => {
                                  const copy = [...editOptions];
                                  copy[i].text = e.target.value;
                                  setEditOptions(copy);
                                }}
                                className="mt-1 block w-full border rounded p-2"
                                placeholder="Option text (optional)"
                              />
                              <label className="block text-xs font-medium mt-1">Option Image (optional)</label>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleEditOptionImageFile(i, e)}
                                  className="mt-1 block border rounded p-2"
                                />
                                {editOptions[i].image && <img src={editOptions[i].image} alt="Preview" className="h-12" />}
                              </div>
                            </div>
                          ))}
                          <div>
                            <label className="block text-sm font-medium">
                              Correct Option
                            </label>
                            <div className="flex gap-4 mt-2">
                              {[0, 1, 2, 3].map((i) => (
                                <label
                                  key={i}
                                  className="inline-flex items-center gap-2"
                                >
                                  <input
                                    type="radio"
                                    name="edit-correct"
                                    checked={editCorrectIndex === i}
                                    onChange={() => setEditCorrectIndex(i)}
                                  />
                                  <span>Option {i + 1}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium">
                              Subject
                            </label>
                            <select
                              value={editSubject}
                              onChange={(e) =>
                                setEditSubject(e.target.value as any)
                              }
                              className="mt-1 block w-full border rounded p-2"
                            >
                              <option value="">Unspecified</option>
                              <option value="Physics">Physics</option>
                              <option value="Chemistry">Chemistry</option>
                              <option value="Mathematics">Mathematics</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="btn-primary px-3 py-1"
                              type="submit"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="px-3 py-1 border rounded"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {q.subject || "Unspecified"}
                              </span>
                              <span className="text-xs text-gray-500">
                                #{String(q._id || "").slice(-6)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm">{q.text}</p>
                            {q.image && (
                              <img src={q.image} alt="Question" className="h-16 my-2" />
                            )}
                            <ul className="mt-2 text-sm list-decimal list-inside">
                              {(q.options || []).map((o: any, idx: number) => (
                                <li
                                  key={idx}
                                  className={`${
                                    q.correctIndex === idx
                                      ? "font-semibold text-green-700"
                                      : ""
                                  }`}
                                >
                                  {o.text}
                                  {o.image && (
                                    <img src={o.image} alt={`Option ${idx + 1}`} className="h-8 ml-2 inline-block align-middle" />
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="ml-4 flex flex-col gap-2">
                            <button
                              className="px-3 py-1 bg-blue-600 text-white rounded"
                              onClick={() => startEdit(q)}
                            >
                              Edit
                            </button>
                            <button
                              className="px-3 py-1 border rounded text-red-600"
                              onClick={() => deleteQuestion(String(q._id))}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
