import { useState, useCallback, Suspense, lazy } from 'react'
import { Routes, Route, Outlet } from 'react-router'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './utils/custom-cursor/CustomCursor'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Archives from './pages/Archives'
import Incidents from './pages/Incidents'
import Operations from './pages/Operations'
import Equipment from './pages/Equipment'
import Personnel from './pages/Personnel'
import News from './pages/News'
import About from './pages/About'
import Contact from './pages/Contact'
import CustomScrollbar from './components/CustomScrollbar'
import { MONO } from './utils/fonts'

// 代码分割：档案详情页动态导入
const ArchiveDetail = lazy(() => import('./pages/ArchiveDetail'))

// CMS 管理后台
const CMSHome = lazy(() => import('./pages/admin/CMSHome'))
const CMSArchiveList = lazy(() => import('./pages/admin/CMSArchiveList'))
const CMSArchiveForm = lazy(() => import('./pages/admin/CMSArchiveForm'))
const CMSNewsList = lazy(() => import('./pages/admin/CMSNewsList'))
const CMSNewsForm = lazy(() => import('./pages/admin/CMSNewsForm'))
const CMSEquipmentList = lazy(() => import('./pages/admin/CMSEquipmentList'))
const CMSEquipmentForm = lazy(() => import('./pages/admin/CMSEquipmentForm'))
const CMSReviewList = lazy(() => import('./pages/admin/CMSReviewList'))
const CMSReviewForm = lazy(() => import('./pages/admin/CMSReviewForm'))
const CMSAnnouncementList = lazy(() => import('./pages/admin/CMSAnnouncementList'))
const CMSAnnouncementForm = lazy(() => import('./pages/admin/CMSAnnouncementForm'))

// 部门官网页面 - 懒加载
const FieldOperations = lazy(() => import('./pages/departments/FieldOperations'))
const ResearchArchives = lazy(() => import('./pages/departments/ResearchArchives'))
const MedicalPsychology = lazy(() => import('./pages/departments/MedicalPsychology'))
const SecurityProtection = lazy(() => import('./pages/departments/SecurityProtection'))
const LogisticsInfrastructure = lazy(() => import('./pages/departments/LogisticsInfrastructure'))

// 懒加载页面骨架屏
function PageSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div
          className="text-xs text-[#d4a373] tracking-widest uppercase mb-4 animate-pulse"
          style={{ fontFamily: MONO }}
        >
          LOADING ARCHIVE DATA...
        </div>
        <div className="w-48 h-[1px] bg-white/10 mx-auto overflow-hidden">
          <div className="h-full bg-[#d4a373] animate-[loadingSlide_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}

// 前台布局 - 包含 CustomScrollbar + Header + Navigation
function FrontendLayout({ loaded, progress }: { loaded: boolean; progress: number }) {
  return (
    <CustomScrollbar className="h-full w-full bg-[#0a0a0a]">
      {!loaded && (
        <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <div
              className="text-[#e60012] font-bold tracking-tighter"
              style={{ fontFamily: MONO, fontSize: '3rem' }}
            >
              {progress}%
            </div>
            <div
              className="mt-4 text-[#888888] text-xs tracking-widest uppercase"
              style={{ fontFamily: MONO }}
            >
              INITIALIZING SECURE CONNECTION
            </div>
          </div>
        </div>
      )}
      <Header />
      <Navigation />
      <main>
        <Outlet />
      </main>
    </CustomScrollbar>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const handleLoadComplete = useCallback(() => {
    setLoaded(true)
  }, [])

  const handleProgressUpdate = useCallback((progress: number) => {
    setLoadingProgress(progress)
  }, [])

  return (
    <>
      {!loaded && <LoadingScreen onProgress={handleProgressUpdate} onComplete={handleLoadComplete} />}
      <CustomCursor />
      <Routes>
        {/* CMS 管理后台 - 不使用 CustomScrollbar/Header/Navigation */}
        <Route path="/admin" element={<Suspense fallback={<PageSkeleton />}><CMSHome /></Suspense>} />
        <Route path="/admin/archives" element={<Suspense fallback={<PageSkeleton />}><CMSArchiveList /></Suspense>} />
        <Route path="/admin/archives/new" element={<Suspense fallback={<PageSkeleton />}><CMSArchiveForm /></Suspense>} />
        <Route path="/admin/archives/:id" element={<Suspense fallback={<PageSkeleton />}><CMSArchiveForm /></Suspense>} />
        <Route path="/admin/news" element={<Suspense fallback={<PageSkeleton />}><CMSNewsList /></Suspense>} />
        <Route path="/admin/news/new" element={<Suspense fallback={<PageSkeleton />}><CMSNewsForm /></Suspense>} />
        <Route path="/admin/news/:id" element={<Suspense fallback={<PageSkeleton />}><CMSNewsForm /></Suspense>} />
        <Route path="/admin/equipment" element={<Suspense fallback={<PageSkeleton />}><CMSEquipmentList /></Suspense>} />
        <Route path="/admin/equipment/new" element={<Suspense fallback={<PageSkeleton />}><CMSEquipmentForm /></Suspense>} />
        <Route path="/admin/equipment/:id" element={<Suspense fallback={<PageSkeleton />}><CMSEquipmentForm /></Suspense>} />
        <Route path="/admin/reviews" element={<Suspense fallback={<PageSkeleton />}><CMSReviewList /></Suspense>} />
        <Route path="/admin/reviews/new" element={<Suspense fallback={<PageSkeleton />}><CMSReviewForm /></Suspense>} />
        <Route path="/admin/reviews/:id" element={<Suspense fallback={<PageSkeleton />}><CMSReviewForm /></Suspense>} />
        <Route path="/admin/announcements" element={<Suspense fallback={<PageSkeleton />}><CMSAnnouncementList /></Suspense>} />
        <Route path="/admin/announcements/new" element={<Suspense fallback={<PageSkeleton />}><CMSAnnouncementForm /></Suspense>} />
        <Route path="/admin/announcements/:id" element={<Suspense fallback={<PageSkeleton />}><CMSAnnouncementForm /></Suspense>} />

        {/* 前台页面 - 使用 FrontendLayout */}
        <Route element={<FrontendLayout loaded={loaded} progress={loadingProgress} />}>
          <Route path="/" element={<Home />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/archives/:category" element={<Archives />} />
          <Route path="/archive/:id" element={<Suspense fallback={<PageSkeleton />}><ArchiveDetail /></Suspense>} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dept/field" element={<Suspense fallback={<PageSkeleton />}><FieldOperations /></Suspense>} />
          <Route path="/dept/research" element={<Suspense fallback={<PageSkeleton />}><ResearchArchives /></Suspense>} />
          <Route path="/dept/medical" element={<Suspense fallback={<PageSkeleton />}><MedicalPsychology /></Suspense>} />
          <Route path="/dept/security" element={<Suspense fallback={<PageSkeleton />}><SecurityProtection /></Suspense>} />
          <Route path="/dept/logistics" element={<Suspense fallback={<PageSkeleton />}><LogisticsInfrastructure /></Suspense>} />
        </Route>
      </Routes>
    </>
  )
}
