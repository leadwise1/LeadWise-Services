                className="flex items-center gap-2 bg-primary hover:bg-opacity-90 text-white px-3 py-1 rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {resume.skills.map((skill) => (
                <div key={skill.id} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Skill name"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-8 border-t">
            <button className="flex-1 bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Download as PDF
            </button>
            <button className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Download as HTML
            </button>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:sticky lg:top-24 h-fit">
          <div className="bg-primary text-white p-4 font-bold">Live Preview</div>
          <div className="p-6 bg-gray-50 max-h-[calc(100vh-180px)] overflow-y-auto">
            <div className="scale-75 origin-top-left" style={{ minWidth: "133.333%" }}>
              <ModernBlueTemplate data={resume} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
