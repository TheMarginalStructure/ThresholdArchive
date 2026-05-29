import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import MDEditor from '@uiw/react-md-editor'
import CMSLayout from '../../components/CMSLayout'
import { api } from '../../lib/api'

const API_BASE = 'http://localhost:3001/api/v1'

interface SignatureEntry {
  personId: string
  position: string
  note: string
}

export default function CMSArchiveForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id && id !== 'new'
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [departments, setDepartments] = useState<any[]>([])
  const [personnel, setPersonnel] = useState<any[]>([])
  const [form, setForm] = useState({
    code: '', category: '阈界档案', title: '', status: '封存',
    threatLevel: '', threatLevelColor: '', accessLevel: '',
    description: '', mainDangers: '', details: '',
    finalReview: '', reviewStatus: 'approved', remarks: '',
    attachmentText: '',
    sourceDepartmentId: '', responsibleDepartmentId: '', leadPersonId: '',
    signatures: [] as SignatureEntry[],
    customTemplate: '', useCustomTemplate: false,
  })
  const [imagePath, setImagePath] = useState('')
  const [videoPath, setVideoPath] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])

  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const cleanPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`
    return `http://localhost:3001${cleanPath}`
  }

  useEffect(() => {
    Promise.all([
      api.departments.list(),
      api.personnel.list(),
    ]).then(([depts, pers]) => {
      setDepartments(Array.isArray(depts) ? depts : [])
      setPersonnel(Array.isArray(pers) ? pers : [])
    }).catch(() => {})

    fetch(`${API_BASE}/cms/templates`)
      .then(r => r.json())
      .then(data => setTemplates(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/cms/archives/${id}`)
        const data = await res.json()
        if (data) {
          setForm({
            code: data.code || '', category: data.category || '阈界档案',
            title: data.title || '', status: data.status || '封存',
            threatLevel: data.threatLevel || '', threatLevelColor: data.threatLevelColor || '',
            accessLevel: data.accessLevel || '', description: data.description || '',
            mainDangers: data.mainDangers || '', details: data.details ? (typeof data.details === 'string' ? data.details : JSON.stringify(data.details, null, 2)) : '',
            finalReview: data.finalReview || '', reviewStatus: data.reviewStatus || 'approved',
            remarks: data.remarks || '', attachmentText: data.attachmentText || '',
            sourceDepartmentId: data.sourceDepartmentId ? String(data.sourceDepartmentId) : '',
            responsibleDepartmentId: data.responsibleDepartmentId ? String(data.responsibleDepartmentId) : '',
            leadPersonId: data.leadPersonId ? String(data.leadPersonId) : '',
            signatures: data.signatures || [],
            customTemplate: data.customTemplate || '',
            useCustomTemplate: data.useCustomTemplate || false,
          })
          setImagePath(data.imagePath || '')
          setVideoPath(data.videoPath || '')
        }
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [id, isEdit])

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) setImagePath(data.url)
    } catch (e) { console.error(e) }
    setUploading(false)
  }

  const handleVideoUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('video', file)
      const res = await fetch(`${API_BASE}/upload/video`, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) setVideoPath(data.url)
    } catch (e) { console.error(e) }
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let parsedDetails: Record<string, unknown> = {}
      try {
        parsedDetails = form.details ? JSON.parse(form.details) : {}
      } catch {
        parsedDetails = {}
      }

      const body: Record<string, unknown> = {
        ...form,
        imagePath,
        videoPath,
        details: parsedDetails,
        sourceDepartmentId: form.sourceDepartmentId || null,
        responsibleDepartmentId: form.responsibleDepartmentId || null,
        leadPersonId: form.leadPersonId || null,
      }

      const url = isEdit ? `${API_BASE}/cms/archives/${id}` : `${API_BASE}/cms/archives`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) navigate('/admin/archives')
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  if (loading) return <CMSLayout><div className="text-center py-20 text-[#888888]">加载中...</div></CMSLayout>

  return (
    <CMSLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">{isEdit ? '编辑档案' : '新建档案'}</h1>
          <p className="text-xs text-[#888888] mt-1">{isEdit ? `编码: ${form.code}` : '填写以下字段创建新的阈界档案'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-xs border border-white/10 rounded hover:bg-white/5">取消</button>
          <button onClick={handleSave} disabled={saving || !form.code || !form.title} className="px-4 py-2 text-xs bg-[#d4a373] text-black rounded hover:bg-[#c49463] disabled:opacity-30 disabled:cursor-not-allowed">
            {saving ? '保存中...' : (isEdit ? '更新' : '保存')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm text-[#d4a373]">基本信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#888888] block mb-1">编码 *</label>
                <input value={form.code} onChange={e => handleChange('code', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none" placeholder="TMS-XXXX" />
              </div>
              <div>
                <label className="text-xs text-[#888888] block mb-1">类别</label>
                <select value={form.category} onChange={e => handleChange('category', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none">
                  <option value="阈界档案">阈界档案</option>
                  <option value="勘探实验记录">勘探记录</option>
                  <option value="事件报告">事件报告</option>
                  <option value="实验记录">实验记录</option>
                  <option value="医疗报告">医疗报告</option>
                  <option value="事件通信">事件通信</option>
                  <option value="协议手册">协议手册</option>
                  <option value="理论文件">理论文件</option>
                  <option value="人事档案">人事档案</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-[#888888] block mb-1">标题 *</label>
              <input value={form.title} onChange={e => handleChange('title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-[#888888] block mb-1">威胁等级</label>
                <input value={form.threatLevel} onChange={e => handleChange('threatLevel', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none" placeholder="琥珀色-C" disabled={form.category !== '阈界档案'} />
                {form.category !== '阈界档案' && <span className="text-[10px] text-[#666]">非阈界档案自动设为不适用</span>}
              </div>
              <div>
                <label className="text-xs text-[#888888] block mb-1">访问权限</label>
                <input value={form.accessLevel} onChange={e => handleChange('accessLevel', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none" placeholder="4级" />
              </div>
              <div>
                <label className="text-xs text-[#888888] block mb-1">状态</label>
                <select value={form.status} onChange={e => handleChange('status', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none">
                  <option value="活跃">活跃</option>
                  <option value="封存">封存</option>
                  <option value="销毁待定">销毁待定</option>
                  <option value="已销毁">已销毁</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-[#888888] block mb-1">概述</label>
              <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none resize-none" />
            </div>
          </div>





          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm text-[#d4a373]">部门与人员</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#888888] block mb-1">来源部门</label>
                <select value={form.sourceDepartmentId} onChange={e => handleChange('sourceDepartmentId', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none">
                  <option value="">选择部门</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#888888] block mb-1">负责部门</label>
                <select value={form.responsibleDepartmentId} onChange={e => handleChange('responsibleDepartmentId', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none">
                  <option value="">选择部门</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-[#888888] block mb-1">负责人</label>
              <select value={form.leadPersonId} onChange={e => handleChange('leadPersonId', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none">
                <option value="">选择人员</option>
                {personnel.map(person => (
                  <option key={person.id} value={person.id}>{person.name}{person.codename ? ` / ${person.codename}` : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm text-[#d4a373]">签名确认</h2>
            <div className="space-y-3">
              {form.signatures.map((sig, i) => {
                const selectedPerson = personnel.find(p => String(p.id) === sig.personId)
                return (
                  <div key={i} className="border border-white/10 rounded p-3 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({
                        ...prev,
                        signatures: prev.signatures.filter((_, idx) => idx !== i),
                      }))}
                      className="absolute top-2 right-2 text-[#e60012] hover:text-[#c40010]"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#888888] block mb-1">签名人员</label>
                        <select
                          value={sig.personId}
                          onChange={(e) => {
                            const newSignatures = [...form.signatures]
                            const person = personnel.find(p => String(p.id) === e.target.value)
                            newSignatures[i] = {
                              ...newSignatures[i],
                              personId: e.target.value,
                              position: person?.position || newSignatures[i].position,
                            }
                            setForm(prev => ({ ...prev, signatures: newSignatures }))
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                        >
                          <option value="">选择人员</option>
                          {personnel.map(person => (
                            <option key={person.id} value={person.id}>{person.name}{person.codename ? ` / ${person.codename}` : ''} · {person.position || ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-[#888888] block mb-1">职位</label>
                        <input
                          value={sig.position}
                          onChange={(e) => {
                            const newSignatures = [...form.signatures]
                            newSignatures[i] = { ...newSignatures[i], position: e.target.value }
                            setForm(prev => ({ ...prev, signatures: newSignatures }))
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[#888888] block mb-1">备注</label>
                      <input
                        value={sig.note}
                        onChange={(e) => {
                          const newSignatures = [...form.signatures]
                          newSignatures[i] = { ...newSignatures[i], note: e.target.value }
                          setForm(prev => ({ ...prev, signatures: newSignatures }))
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                      />
                    </div>
                    {selectedPerson && (
                      <div className="text-xs text-[#666]">
                        电子签名: {selectedPerson.esigCode || '[ESIG-??]'}
                      </div>
                    )}
                  </div>
                )
              })}
              <button
                type="button"
                onClick={() => setForm(prev => ({
                  ...prev,
                  signatures: [...prev.signatures, { personId: '', position: '', note: '' }],
                }))}
                className="text-[#d4a373] hover:text-[#c49463] text-xs flex items-center gap-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                添加签名
              </button>
            </div>
          </div>

          <div className="border border-white/10 rounded p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-[#d4a373]">详细内容（Markdown）</h2>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs text-[#888888]">自定义模板</span>
                <div className={`relative w-10 h-5 rounded-full transition-colors ${form.useCustomTemplate ? 'bg-[#d4a373]' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.useCustomTemplate ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <input
                  type="checkbox"
                  checked={form.useCustomTemplate}
                  onChange={(e) => setForm(prev => ({ ...prev, useCustomTemplate: e.target.checked }))}
                  className="hidden"
                />
              </label>
            </div>
            {form.useCustomTemplate && templates.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#666]">快捷模板：</span>
                <select
                  onChange={(e) => {
                    if (!e.target.value) return
                    const tpl = templates.find(t => String(t.id) === e.target.value)
                    if (tpl) setForm(prev => ({ ...prev, customTemplate: tpl.content }))
                  }}
                  className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs focus:border-[#d4a373] focus:outline-none"
                >
                  <option value="">选择模板...</option>
                  {templates.map(tpl => (
                    <option key={tpl.id} value={tpl.id}>{tpl.name}{tpl.category ? ` (${tpl.category})` : ''}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="border border-white/10 rounded overflow-hidden" data-color-mode="dark">
              <MDEditor
                value={form.useCustomTemplate ? form.customTemplate : form.details}
                onChange={(val) => handleChange(form.useCustomTemplate ? 'customTemplate' : 'details', val || '')}
                preview="edit"
                height={400}
              />
            </div>
          </div>

          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm text-[#d4a373]">附件文本</h2>
            <p className="text-xs text-[#666]">点击"读取源文件"按钮时展示的内容，支持 Markdown</p>
            <div className="border border-white/10 rounded overflow-hidden" data-color-mode="dark">
              <MDEditor value={form.attachmentText} onChange={(val) => handleChange('attachmentText', val || '')} preview="edit" height={300} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm text-[#d4a373]">封面图片</h2>
            {imagePath ? (
              <div className="relative group">
                <img src={getImageUrl(imagePath)} alt="cover" className="w-full aspect-square object-cover rounded border border-white/10" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => setImagePath('')} className="text-xs text-[#e60012] px-3 py-1 border border-[#e60012] rounded">移除</button>
                  <label className="text-xs text-[#d4a373] px-3 py-1 border border-[#d4a373] rounded cursor-pointer">
                    更换
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                  </label>
                </div>
              </div>
            ) : (
              <div
                className={`aspect-square rounded border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${dragging ? 'border-[#d4a373] bg-[#d4a373]/5' : 'border-white/10 hover:border-white/20'}`}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleImageUpload(e.dataTransfer.files[0]) }}
                onClick={() => document.getElementById('cms-archive-img')?.click()}
              >
                {uploading ? <span className="text-xs text-[#888888]">上传中...</span> : (
                  <>
                    <svg className="w-6 h-6 text-[#666666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <span className="text-xs text-[#666]">拖拽或点击上传</span>
                  </>
                )}
                <input id="cms-archive-img" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
              </div>
            )}
          </div>

          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm text-[#d4a373]">档案视频</h2>
            {videoPath ? (
              <div className="relative group">
                <video src={getImageUrl(videoPath)} controls className="w-full aspect-square object-cover rounded border border-white/10" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => setVideoPath('')} className="text-xs text-[#e60012] px-3 py-1 border border-[#e60012] rounded">移除</button>
                  <label className="text-xs text-[#d4a373] px-3 py-1 border border-[#d4a373] rounded cursor-pointer">
                    更换
                    <input type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && handleVideoUpload(e.target.files[0])} />
                  </label>
                </div>
              </div>
            ) : (
              <div
                className={`aspect-square rounded border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${dragging ? 'border-[#d4a373] bg-[#d4a373]/5' : 'border-white/10 hover:border-white/20'}`}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleVideoUpload(e.dataTransfer.files[0]) }}
                onClick={() => document.getElementById('cms-archive-video')?.click()}
              >
                {uploading ? <span className="text-xs text-[#888888]">上传中...</span> : (
                  <>
                    <svg className="w-6 h-6 text-[#666666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="18" rx="2" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" /></svg>
                    <span className="text-xs text-[#666]">上传视频（MP4/WebM）</span>
                  </>
                )}
                <input id="cms-archive-video" type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && handleVideoUpload(e.target.files[0])} />
              </div>
            )}
          </div>

          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm text-[#d4a373]">其他信息</h2>
            <div>
              <label className="text-xs text-[#888888] block mb-1">主要危险</label>
              <textarea value={form.mainDangers} onChange={e => handleChange('mainDangers', e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none resize-none" />
            </div>
            <div>
              <label className="text-xs text-[#888888] block mb-1">最终审核</label>
              <input value={form.finalReview} onChange={e => handleChange('finalReview', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-[#888888] block mb-1">备注</label>
              <textarea value={form.remarks} onChange={e => handleChange('remarks', e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none resize-none" />
            </div>
          </div>
        </div>
      </div>
    </CMSLayout>
  )
}