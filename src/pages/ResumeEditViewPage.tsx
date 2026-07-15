import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type MouseEvent } from 'react'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { CollapsibleSection } from '../components/CollapsibleSection'
import { FeaturedProjectModal } from '../components/FeaturedProjectModal'
import { ProfessionalHistoryModal } from '../components/ProfessionalHistoryModal'
import { TechnicalSkillCategoryModal } from '../components/TechnicalSkillCategoryModal'
import { TechnicalSkillCategoryRow } from '../components/TechnicalSkillCategoryRow'
import { ResumePreview, TemplateSelector } from '../components/resume-preview'
import { useMediaQuery } from '../hooks'
import { ROUTES, ROUTE_PATHS } from '../router'
import { getResumeById, saveResume, updateResume } from '../services/resumeService'
import { clearAuthSession, getValidAuthSession } from '../storage/authStorage'
import {
  createEmptyResumeForm,
  formStateToPreviewData,
  formStateToSaveRequest,
  formStateToUpdateRequest,
  resumeToFormState,
  type ResumeFormState,
  type FeaturedProjectForm,
  type ProfessionalHistoryForm,
  type SkillCategoryDraft,
  type TechnicalSkillForm,
} from '../types'
import './ResumeEditViewPage.css'
import { exportResumePdf } from '../utils/exportResumePdf'
import { derivePhotoFileName, readPhotoFile } from '../utils/photoUpload'

type EditPageMode = 'new' | 'edit'

const EMPTY_SKILL_CATEGORY: SkillCategoryDraft = {
  category: '',
  skills: [
    {
      category: '',
      skillName: '',
      yearsOfExperience: 0,
    },
  ],
}

const EMPTY_PROFESSIONAL_HISTORY: ProfessionalHistoryForm = {
  company: '',
  role: '',
  period: '',
  location: '',
  achievements: [''],
}

const EMPTY_FEATURED_PROJECT: FeaturedProjectForm = {
  name: '',
  description: '',
  technologies: [''],
}

function formatProfessionalHistorySecondary(entry: ProfessionalHistoryForm): string {
  const role = entry.role.trim() || 'Untitled position'
  const period = entry.period.trim() || 'No period'

  return `${role}, ${period}`
}

function formatFeaturedProjectLabel(entry: FeaturedProjectForm): string {
  const name = entry.name.trim() || 'Untitled project'
  const technologyCount = entry.technologies
    .map((technology) => technology.trim())
    .filter(Boolean).length
  const technologyLabel =
    technologyCount === 1 ? '1 technology' : `${technologyCount} technologies`

  return `${name} · ${technologyLabel}`
}

function PreviewPanelIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="5" width="16" height="14" rx="1.5" />
      <path d="M13 5v14" />
    </svg>
  )
}

function EditFormPanelIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="5" width="16" height="14" rx="1.5" />
      <path d="M11 5v14" />
      <path d="M7 9h1" />
      <path d="M7 12h1" />
      <path d="M7 15h1" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v9" />
      <path d="M8.5 9.5 12 13l3.5-3.5" />
      <path d="M5 19h14" />
      <path d="M5 19v-2" />
      <path d="M19 19v-2" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.86a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.88.34H9a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.88V9a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  )
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function ResumeEditViewPage() {
  const navigate = useNavigate()
  const { resumeId } = useParams()
  const isNewRoute = useMatch(ROUTE_PATHS.resumeCreate) !== null
  const mode: EditPageMode = isNewRoute ? 'new' : 'edit'

  const [form, setForm] = useState<ResumeFormState>(() => createEmptyResumeForm())
  const [userId, setUserId] = useState<number | null>(null)
  const [editingResumeId, setEditingResumeId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(true)
  const [isSidePreviewOpen, setIsSidePreviewOpen] = useState(true)
  const [isActionsPanelOpen, setIsActionsPanelOpen] = useState(false)
  const [isPhotoDragging, setIsPhotoDragging] = useState(false)
  const [photoSideLength, setPhotoSideLength] = useState(140)
  const [isSkillCategoryModalOpen, setIsSkillCategoryModalOpen] = useState(false)
  const [editingSkillCategoryCategory, setEditingSkillCategoryCategory] =
  useState<string | null>(null)
  const [skillCategoryModalDraft, setSkillCategoryModalDraft] =
  useState<SkillCategoryDraft>(EMPTY_SKILL_CATEGORY)
  const [isProfessionalHistoryModalOpen, setIsProfessionalHistoryModalOpen] = useState(false)
  const [editingProfessionalHistoryIndex, setEditingProfessionalHistoryIndex] = useState<
    number | null
  >(null)
  const [professionalHistoryModalDraft, setProfessionalHistoryModalDraft] =
    useState<ProfessionalHistoryForm>(EMPTY_PROFESSIONAL_HISTORY)
  const [isFeaturedProjectModalOpen, setIsFeaturedProjectModalOpen] = useState(false)
  const [editingFeaturedProjectIndex, setEditingFeaturedProjectIndex] = useState<number | null>(
    null
  )
  const [featuredProjectModalDraft, setFeaturedProjectModalDraft] =
    useState<FeaturedProjectForm>(EMPTY_FEATURED_PROJECT)
  const photoDragCounter = useRef(0)
  const personalPrimaryRef = useRef<HTMLDivElement>(null)

  const isWideScreen = useMediaQuery('(min-width: 720px)')
  const isCompactPersonalLayout = useMediaQuery('(max-width: 560px)')
  const showEditForm = isEditFormOpen
  const showSidePreview = isWideScreen && isSidePreviewOpen
  const previewData = useMemo(() => formStateToPreviewData(form), [form])

  const groupedTechnicalSkills = useMemo(() => {
    const grouped = form.technicalSkills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = []
        }
  
        acc[skill.category].push(skill)
  
        return acc
      },
      {} as Record<string, TechnicalSkillForm[]>
    )
  
    return Object.entries(grouped).map(([category, skills]) => ({
      category,
      skills,
    }))
  }, [form.technicalSkills])

  useEffect(() => {
    if (!isWideScreen) {
      setIsSidePreviewOpen(false)
    }
  }, [isWideScreen])

  useEffect(() => {
    if (isCompactPersonalLayout) {
      return
    }

    const node = personalPrimaryRef.current
    if (!node) {
      return
    }

    const updatePhotoSize = () => {
      const { height } = node.getBoundingClientRect()
      // Subtract label + gap so the square aligns with the three inputs, not the whole column.
      const labelOffset = 32
      setPhotoSideLength(Math.max(120, Math.round(height - labelOffset)))
    }

    updatePhotoSize()

    const observer = new ResizeObserver(updatePhotoSize)
    observer.observe(node)

    return () => observer.disconnect()
  }, [isCompactPersonalLayout, isLoading])

  useEffect(() => {
    const session = getValidAuthSession()

    if (!session) {
      navigate(ROUTES.login, { replace: true })
      return
    }

    setUserId(session.userId)

    if (mode === 'new') {
      setEditingResumeId(null)
      setForm(createEmptyResumeForm(session.email))
      setIsLoading(false)
      return
    }

    const parsedId = Number(resumeId)
    if (!resumeId || Number.isNaN(parsedId)) {
      navigate(ROUTES.resumes, { replace: true })
      return
    }

    setEditingResumeId(parsedId)

    async function loadResume() {
      try {
        const resume = await getResumeById(parsedId)
        setForm(resumeToFormState(resume))
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearAuthSession()
          navigate(ROUTES.login, { replace: true })
          return
        }

        setError(err instanceof Error ? err.message : 'Unable to load resume.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadResume()
  }, [mode, navigate, resumeId])

  function openCreateSkillCategoryModal() {
    setEditingSkillCategoryCategory(null)
  
    setSkillCategoryModalDraft({
      category: '',
      skills: [
        {
          category: '',
          skillName: '',
          yearsOfExperience: 0,
        },
      ],
    })
  
    setIsSkillCategoryModalOpen(true)
  }

  function openEditSkillCategoryModal(category: string) {
    const skills = form.technicalSkills.filter(
      (skill) => skill.category === category
    )

    setEditingSkillCategoryCategory(category)
  
    setSkillCategoryModalDraft({
      category,
      skills,
    })
  
    setIsSkillCategoryModalOpen(true)
  }

  function deleteSkillCategory(category: string) {
    setForm((current) => ({
      ...current,
      technicalSkills: current.technicalSkills.filter(
        (skill) => skill.category !== category
      ),
    }))
  }

  function saveSkillCategory(value: SkillCategoryDraft) {
    const category = value.category.trim()
  
    const skills = value.skills
      .map((skill) => ({
        category,
        skillName: skill.skillName.trim(),
        yearsOfExperience: skill.yearsOfExperience,
      }))
      .filter((skill) => skill.skillName)
  
    setForm((current) => {
      const remainingSkills =
        editingSkillCategoryCategory === null
          ? current.technicalSkills
          : current.technicalSkills.filter(
              (skill) => skill.category !== editingSkillCategoryCategory
            )
  
      return {
        ...current,
        technicalSkills: [...remainingSkills, ...skills],
      }
    })
  
    setEditingSkillCategoryCategory(null)
    setIsSkillCategoryModalOpen(false)
  }

  function openCreateProfessionalHistoryModal() {
    setEditingProfessionalHistoryIndex(null)
    setProfessionalHistoryModalDraft({ ...EMPTY_PROFESSIONAL_HISTORY, achievements: [''] })
    setIsProfessionalHistoryModalOpen(true)
  }

  function openEditProfessionalHistoryModal(index: number) {
    const entry = form.professionalHistory[index]

    setEditingProfessionalHistoryIndex(index)
    setProfessionalHistoryModalDraft({
      company: entry.company,
      role: entry.role,
      period: entry.period,
      location: entry.location,
      achievements: entry.achievements.length > 0 ? [...entry.achievements] : [''],
    })
    setIsProfessionalHistoryModalOpen(true)
  }

  function deleteProfessionalHistory(index: number) {
    setForm((current) => ({
      ...current,
      professionalHistory: current.professionalHistory.filter(
        (_, historyIndex) => historyIndex !== index
      ),
    }))
  }

  function saveProfessionalHistory(value: ProfessionalHistoryForm) {
    const normalized: ProfessionalHistoryForm = {
      company: value.company.trim(),
      role: value.role.trim(),
      period: value.period.trim(),
      location: value.location.trim(),
      achievements: value.achievements.map((achievement) => achievement.trim()).filter(Boolean),
    }

    setForm((current) => {
      if (editingProfessionalHistoryIndex === null) {
        return {
          ...current,
          professionalHistory: [...current.professionalHistory, normalized],
        }
      }

      return {
        ...current,
        professionalHistory: current.professionalHistory.map((entry, index) =>
          index === editingProfessionalHistoryIndex ? normalized : entry
        ),
      }
    })
    setIsProfessionalHistoryModalOpen(false)
  }

  function openCreateFeaturedProjectModal() {
    setEditingFeaturedProjectIndex(null)
    setFeaturedProjectModalDraft({ ...EMPTY_FEATURED_PROJECT, technologies: [''] })
    setIsFeaturedProjectModalOpen(true)
  }

  function openEditFeaturedProjectModal(index: number) {
    const entry = form.featuredProjects[index]

    setEditingFeaturedProjectIndex(index)
    setFeaturedProjectModalDraft({
      name: entry.name,
      description: entry.description,
      technologies: entry.technologies.length > 0 ? [...entry.technologies] : [''],
    })
    setIsFeaturedProjectModalOpen(true)
  }

  function deleteFeaturedProject(index: number) {
    setForm((current) => ({
      ...current,
      featuredProjects: current.featuredProjects.filter(
        (_, projectIndex) => projectIndex !== index
      ),
    }))
  }

  function saveFeaturedProject(value: FeaturedProjectForm) {
    const normalized: FeaturedProjectForm = {
      name: value.name.trim(),
      description: value.description.trim(),
      technologies: value.technologies.map((technology) => technology.trim()).filter(Boolean),
    }

    setForm((current) => {
      if (editingFeaturedProjectIndex === null) {
        return {
          ...current,
          featuredProjects: [...current.featuredProjects, normalized],
        }
      }

      return {
        ...current,
        featuredProjects: current.featuredProjects.map((entry, index) =>
          index === editingFeaturedProjectIndex ? normalized : entry
        ),
      }
    })
    setIsFeaturedProjectModalOpen(false)
  }

  function updatePersonalInfo(field: keyof ResumeFormState['personalInfo'], value: string) {
    setForm((current) => ({
      ...current,
      personalInfo: {
        ...current.personalInfo,
        [field]: value,
        ...(field === 'photo'
          ? {
              photoImage: undefined,
              photoMimeType: undefined,
              photoFileName: value.trim()
                ? derivePhotoFileName(value)
                : undefined,
            }
          : {}),
      },
    }))
  }

  async function processPhotoFile(file: File) {
    try {
      const parsed = await readPhotoFile(file)
      setForm((current) => ({
        ...current,
        personalInfo: {
          ...current.personalInfo,
          photo: parsed.photo,
          photoImage: parsed.photoImage,
          photoMimeType: parsed.photoMimeType,
          photoFileName: parsed.photoFileName,
        },
      }))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to upload photo.')
    }
  }

  async function handlePhotoFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    await processPhotoFile(file)
  }

  function handlePhotoDragEnter(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    event.stopPropagation()
    photoDragCounter.current += 1
    setIsPhotoDragging(true)
  }

  function handlePhotoDragLeave(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    event.stopPropagation()
    photoDragCounter.current -= 1

    if (photoDragCounter.current <= 0) {
      photoDragCounter.current = 0
      setIsPhotoDragging(false)
    }
  }

  function handlePhotoDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    event.stopPropagation()
  }

  async function handlePhotoDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    event.stopPropagation()
    photoDragCounter.current = 0
    setIsPhotoDragging(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      await processPhotoFile(file)
    }
  }

  function handlePhotoClear(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    clearPhoto()
  }

  function clearPhoto() {
    setForm((current) => ({
      ...current,
      personalInfo: {
        ...current.personalInfo,
        photo: '',
        photoImage: '',
        photoMimeType: undefined,
        photoFileName: undefined,
      },
    }))
  }

  const photoPreviewSrc = form.personalInfo.photo?.trim() || null

  async function handleSave() {
    if (!userId) {
      return
    }

    if (!form.resumeName.trim()) {
      setError('Resume name is required.')
      return
    }

    if (!form.personalInfo.name.trim()) {
      setError('Full name is required in personal information.')
      return
    }

    setError(null)
    setSuccess(null)
    setIsSaving(true)

    try {
      if (mode === 'new') {
        await saveResume(formStateToSaveRequest(form, userId))
      } else if (editingResumeId) {
        await updateResume(
          formStateToUpdateRequest(form, userId, editingResumeId)
        )
      }

      navigate(ROUTES.resumes, { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAuthSession()
        navigate(ROUTES.login, { replace: true })
        return
      }

      setError(err instanceof Error ? err.message : 'Unable to save resume.')
    } finally {
      setIsSaving(false)
    }
  }

  function handleExportJson() {
    if (!userId) {
      return
    }

    downloadJson(
      mode === 'edit' && editingResumeId
        ? formStateToUpdateRequest(form, userId, editingResumeId)
        : formStateToSaveRequest(form, userId),
      `${form.resumeName.trim() || 'resume'}.json`
    )
    setSuccess('Resume exported as JSON.')
  }

  async function handleExportPdf() {
    setError(null)
    setSuccess(null)
    setIsExportingPdf(true)

    try {
      await exportResumePdf({
        data: previewData,
        templateName: form.templateName,
        filename: `${form.resumeName.trim() || 'resume'}.pdf`,
      })
      setSuccess('PDF export opened. Choose Save as PDF in the print dialog.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to export PDF.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  function handleClose() {
    navigate(ROUTES.resumes)
  }

  if (isLoading) {
    return (
      <div className="resume-edit">
        <div className="resume-edit__form">
          <p>Loading resume...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`resume-edit${showSidePreview ? ' resume-edit--with-preview' : ''}${
        showEditForm ? '' : ' resume-edit--form-hidden'
      }`}
    >
      <header className="resume-edit__toolbar">
        <div className="resume-edit__view-toggles" role="group" aria-label="Editor layout">
          <button
            type="button"
            className={`resume-edit__settings-button${
              showEditForm ? ' resume-edit__settings-button--active' : ''
            }`}
            onClick={() => setIsEditFormOpen((current) => !current)}
            aria-label={showEditForm ? 'Hide editable form' : 'Show editable form'}
            aria-pressed={showEditForm}
            title={showEditForm ? 'Hide editable form' : 'Show editable form'}
          >
            <EditFormPanelIcon />
          </button>
          {isWideScreen ? (
            <button
              type="button"
              className={`resume-edit__settings-button${
                showSidePreview ? ' resume-edit__settings-button--active' : ''
              }`}
              onClick={() => setIsSidePreviewOpen((current) => !current)}
              aria-label={showSidePreview ? 'Hide side preview' : 'Show side preview'}
              aria-pressed={showSidePreview}
              title={showSidePreview ? 'Hide side preview' : 'Show side preview'}
            >
              <PreviewPanelIcon />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          className={`resume-edit__settings-button${
            isActionsPanelOpen ? ' resume-edit__settings-button--active' : ''
          }`}
          onClick={() => setIsActionsPanelOpen((current) => !current)}
          aria-label={isActionsPanelOpen ? 'Hide actions panel' : 'Show actions panel'}
          aria-expanded={isActionsPanelOpen}
          aria-controls="resume-actions-panel"
          title={isActionsPanelOpen ? 'Hide actions panel' : 'Show actions panel'}
        >
          <GearIcon />
        </button>
      </header>

      <aside
        id="resume-actions-panel"
        className={`resume-edit__actions-panel${
          isActionsPanelOpen ? ' resume-edit__actions-panel--open' : ''
        }`}
        aria-hidden={!isActionsPanelOpen}
        inert={isActionsPanelOpen ? undefined : true}
      >
        <div className="resume-edit__actions-panel-header">
          <button
            type="button"
            className="resume-edit__actions-panel-close"
            onClick={() => setIsActionsPanelOpen(false)}
            aria-label="Close actions panel"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="resume-edit__actions-panel-body">
          <TemplateSelector
            value={form.templateName}
            onChange={(templateId) =>
              setForm((current) => ({
                ...current,
                templateName: templateId,
              }))
            }
          />
          <button type="button" className="resume-edit__button" onClick={handleExportJson}>
            Export JSON
          </button>
          <button
            type="button"
            className="resume-edit__button"
            onClick={() => void handleExportPdf()}
            disabled={isExportingPdf}
          >
            {isExportingPdf ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
            type="button"
            className="resume-edit__button resume-edit__button--primary"
            onClick={() => void handleSave()}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="resume-edit__button" onClick={handleClose}>
            Close
          </button>
        </div>
      </aside>

      {error ? <p className="resume-edit__error">{error}</p> : null}
      {success ? <p className="resume-edit__success">{success}</p> : null}

      <div className="resume-edit__workspace">
        <form
          className={`resume-edit__form${
            showEditForm ? '' : ' resume-edit__form--hidden'
          }`}
          aria-hidden={!showEditForm}
          inert={showEditForm ? undefined : true}
          onSubmit={(event) => {
            event.preventDefault()
            void handleSave()
          }}
        >
          <div className="resume-edit__content">
          <CollapsibleSection title="Resume details">
            <div className="resume-edit__field">
              <label htmlFor="resumeName">Resume name</label>
              <input
                id="resumeName"
                value={form.resumeName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    resumeName: event.target.value,
                  }))
                }
                placeholder="Senior Software Engineer Resume"
                required
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Personal information">
            <div className="resume-edit__personal-header">
              <div className="resume-edit__field resume-edit__photo-field">
                <label htmlFor="photoFile">Profile photo</label>
                <div className="resume-edit__photo-control">
                  <div
                    className="resume-edit__photo-dropzone-wrap"
                    style={
                      isCompactPersonalLayout
                        ? { width: 128, height: 128 }
                        : { width: photoSideLength, height: photoSideLength }
                    }
                  >
                    <label
                      htmlFor="photoFile"
                      className={`resume-edit__photo-dropzone${
                        isPhotoDragging ? ' resume-edit__photo-dropzone--dragging' : ''
                      }${photoPreviewSrc ? ' resume-edit__photo-dropzone--has-photo' : ''}`}
                      onDragEnter={handlePhotoDragEnter}
                      onDragLeave={handlePhotoDragLeave}
                      onDragOver={handlePhotoDragOver}
                      onDrop={handlePhotoDrop}
                    >
                      {photoPreviewSrc ? (
                        <img
                          className="resume-edit__photo-preview"
                          src={photoPreviewSrc}
                          alt=""
                        />
                      ) : null}
                      <span className="resume-edit__photo-dropzone-prompt">
                        <UploadIcon />
                        <span>
                          <strong>Choose a file</strong> or drag it here.
                        </span>
                      </span>
                    </label>
                    {photoPreviewSrc ? (
                      <button
                        type="button"
                        className="resume-edit__photo-clear"
                        onClick={handlePhotoClear}
                        aria-label="Remove photo"
                      >
                        <CloseIcon />
                      </button>
                    ) : null}
                    <input
                      id="photoFile"
                      type="file"
                      className="resume-edit__photo-input"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handlePhotoFileChange}
                    />
                  </div>
                </div>
              </div>

              <div ref={personalPrimaryRef} className="resume-edit__personal-primary">
                <div className="resume-edit__field">
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    value={form.personalInfo.name}
                    onChange={(event) => updatePersonalInfo('name', event.target.value)}
                  />
                </div>
                <div className="resume-edit__field">
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    value={form.personalInfo.title ?? ''}
                    onChange={(event) => updatePersonalInfo('title', event.target.value)}
                  />
                </div>
                <div className="resume-edit__field">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    value={form.personalInfo.address ?? ''}
                    onChange={(event) => updatePersonalInfo('address', event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="resume-edit__personal-fields">
              <div className="resume-edit__grid resume-edit__grid--two">
                <div className="resume-edit__field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    value={form.personalInfo.phone ?? ''}
                    onChange={(event) => updatePersonalInfo('phone', event.target.value)}
                  />
                </div>
                <div className="resume-edit__field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    value={form.personalInfo.email ?? ''}
                    onChange={(event) => updatePersonalInfo('email', event.target.value)}
                  />
                </div>
              </div>
              <div className="resume-edit__grid resume-edit__grid--two">
                <div className="resume-edit__field">
                  <label htmlFor="github">GitHub</label>
                  <input
                    id="github"
                    value={form.personalInfo.github ?? ''}
                    onChange={(event) => updatePersonalInfo('github', event.target.value)}
                  />
                </div>
                <div className="resume-edit__field">
                  <label htmlFor="linkedin">LinkedIn</label>
                  <input
                    id="linkedin"
                    value={form.personalInfo.linkedin ?? ''}
                    onChange={(event) => updatePersonalInfo('linkedin', event.target.value)}
                  />
                </div>
              </div>
              <div className="resume-edit__field">
                <label htmlFor="summary">Summary</label>
                <textarea
                  id="summary"
                  value={form.personalInfo.summary ?? ''}
                  onChange={(event) => updatePersonalInfo('summary', event.target.value)}
                />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Technical skills">
            <div className="resume-edit__section-toolbar">
              <button
                type="button"
                className="resume-edit__add-btn"
                aria-label="Add skill category"
                onClick={openCreateSkillCategoryModal}
              >
                +
              </button>
            </div>

            {groupedTechnicalSkills.length === 0 ? (
              <p className="resume-edit__empty-hint">
                No skill categories yet.
              </p>
            ) : (
              <div className="resume-edit__skill-category-list">
                {groupedTechnicalSkills.map((categoryEntry) => (
                  <TechnicalSkillCategoryRow
                    key={categoryEntry.category}
                    category={categoryEntry.category}
                    skills={categoryEntry.skills.map((skill) => skill.skillName)}
                    menuAriaLabel="Category options"
                    onEdit={() => openEditSkillCategoryModal(categoryEntry.category)}
                    onDelete={() => deleteSkillCategory(categoryEntry.category)}
                  />
                ))}
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Professional history">
            <div className="resume-edit__section-toolbar">
              <button
                type="button"
                className="resume-edit__add-btn"
                aria-label="Add professional history"
                onClick={openCreateProfessionalHistoryModal}
              >
                +
              </button>
            </div>

            {form.professionalHistory.length === 0 ? (
              <p className="resume-edit__empty-hint">No professional history yet.</p>
            ) : (
              <div className="resume-edit__skill-category-list">
                {form.professionalHistory.map((entry, historyIndex) => (
                  <TechnicalSkillCategoryRow
                    key={`history-${historyIndex}`}
                    primaryTitle={entry.company}
                    secondaryText={formatProfessionalHistorySecondary(entry)}
                    menuAriaLabel="Position options"
                    onEdit={() => openEditProfessionalHistoryModal(historyIndex)}
                    onDelete={() => deleteProfessionalHistory(historyIndex)}
                  />
                ))}
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Featured projects">
            <div className="resume-edit__section-toolbar">
              <button
                type="button"
                className="resume-edit__add-btn"
                aria-label="Add featured project"
                onClick={openCreateFeaturedProjectModal}
              >
                +
              </button>
            </div>

            {form.featuredProjects.length === 0 ? (
              <p className="resume-edit__empty-hint">No featured projects yet.</p>
            ) : (
              <div className="resume-edit__skill-category-list">
                {form.featuredProjects.map((project, projectIndex) => (
                  <TechnicalSkillCategoryRow
                    key={`project-${projectIndex}`}
                    label={formatFeaturedProjectLabel(project)}
                    menuAriaLabel="Project options"
                    onEdit={() => openEditFeaturedProjectModal(projectIndex)}
                    onDelete={() => deleteFeaturedProject(projectIndex)}
                  />
                ))}
              </div>
            )}
          </CollapsibleSection>
          </div>
        </form>

        {isWideScreen ? (
          <aside
            className={`resume-edit__preview-panel${
              showSidePreview ? '' : ' resume-edit__preview-panel--hidden'
            }`}
            aria-label="Resume preview"
            aria-hidden={!showSidePreview}
            inert={showSidePreview ? undefined : true}
          >
            <div className="resume-edit__preview-panel-header">
              <h2 className="resume-edit__preview-panel-title">Live preview</h2>
              <button
                type="button"
                className="resume-edit__preview-panel-close"
                onClick={() => setIsSidePreviewOpen(false)}
                aria-label="Close side preview"
              >
                ×
              </button>
            </div>
            <div className="resume-edit__preview-canvas">
              <ResumePreview
                data={previewData}
                templateName={form.templateName}
                className="resume-preview--panel"
              />
            </div>
          </aside>
        ) : null}
      </div>

      <TechnicalSkillCategoryModal
        isOpen={isSkillCategoryModalOpen}
        initialValue={skillCategoryModalDraft}
        title={
          editingSkillCategoryCategory === null
            ? 'Add skill category'
            : 'Edit skill category'
        }
        onClose={() => setIsSkillCategoryModalOpen(false)}
        onSave={saveSkillCategory}
      />

      <ProfessionalHistoryModal
        isOpen={isProfessionalHistoryModalOpen}
        initialValue={professionalHistoryModalDraft}
        title={
          editingProfessionalHistoryIndex === null ? 'Add position' : 'Edit position'
        }
        onClose={() => setIsProfessionalHistoryModalOpen(false)}
        onSave={saveProfessionalHistory}
      />

      <FeaturedProjectModal
        isOpen={isFeaturedProjectModalOpen}
        initialValue={featuredProjectModalDraft}
        title={editingFeaturedProjectIndex === null ? 'Add project' : 'Edit project'}
        onClose={() => setIsFeaturedProjectModalOpen(false)}
        onSave={saveFeaturedProject}
      />
    </div>
  )
}
