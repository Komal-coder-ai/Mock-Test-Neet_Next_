import { useEffect, useState } from "react";
import { authApi } from "../../../lib/authApi";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ReviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [submission, setSubmission] = useState<any>(null);
  const [paper, setPaper] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    try {
      const raw = localStorage.getItem(`lastSubmission_${String(id)}`);
      if (raw) setSubmission(JSON.parse(raw));
    } catch (e) {
      console.warn(e);
    }

    authApi({ url: `/api/papers/${String(id)}` })
      .then((data: any) => {
        if (data?.ok) setPaper(data.paper);
      })
      .catch(console.error);
  }, [id]);

  if (!submission || !paper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
          <div className="text-lg text-gray-700 font-semibold">
            Loading review...
          </div>
        </div>
      </div>
    );
  }

  const answers = submission.answers || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Answer Review</h2>
          <div className="text-sm text-gray-600">Paper: {paper.title}</div>
        </div>

        <div className="space-y-4">
          {(paper.questions || []).map((q: any, idx: number) => {
            const qid = q && q._id ? String(q._id) : String(idx);
            const selected = answers[qid];
            const correct =
              typeof q.correctIndex === "number" ? q.correctIndex : null;
            const isCorrect =
              selected !== undefined &&
              selected !== null &&
              correct !== null &&
              Number(selected) === Number(correct);

            return (
              <motion.div
                key={qid}
                className="bg-white p-5 rounded-lg border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-500">
                      Question {idx + 1} • {q.subject || "General"}
                    </div>
                    <div className="mt-2 text-gray-900">{q.text}</div>
                  </div>
                  <div className="text-right">
                    {isCorrect ? (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 /> Correct
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle /> Incorrect
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {(q.options || []).map((opt: string, oi: number) => {
                    const isSelected =
                      selected !== undefined && Number(selected) === oi;
                    const isAnswer = correct !== null && Number(correct) === oi;
                    let cls = "border rounded-lg p-3";
                    if (isAnswer)
                      cls =
                        "border-2 border-green-400 bg-green-50 rounded-lg p-3";
                    else if (isSelected && !isAnswer)
                      cls = "border-2 border-red-300 bg-red-50 rounded-lg p-3";
                    else cls = "border rounded-lg p-3";

                    return (
                      <div key={oi} className={cls}>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {String.fromCharCode(65 + oi)}
                          </div>
                          <div className="text-gray-900">{opt}</div>
                          {isAnswer && (
                            <div className="ml-auto text-sm text-green-700 font-semibold">
                              Correct Answer
                            </div>
                          )}
                          {!isAnswer && isSelected && (
                            <div className="ml-auto text-sm text-red-600 font-semibold">
                              Your Answer
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            className="w-full md:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold flex items-center justify-center gap-2 shadow"
            onClick={() => {
              localStorage.removeItem(`lastSubmission_${String(id)}`);
              router.push(`/test/${String(id)}/begin`);
            }}
          >
            Try Again
          </button>{" "}
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            onClick={() => router.push("/")}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
