const TermsAndConditions = ({ clientNote, terms, setClientNote, setTerms }) => {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm">
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Client Note</label>
        <textarea
          value={clientNote}
          onChange={(e) => setClientNote(e.target.value)}
          rows="3"
          className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Terms & Conditions</label>
        <textarea
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          rows="3"
          className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default TermsAndConditions;
