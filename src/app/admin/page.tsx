"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Quote, QuoteFormData } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useQuotes } from "@/hooks/useQuotes";
import { useImagenes } from "@/hooks/useImagenes";
import { useFilters } from "@/hooks/useFilters";
import { usePagination } from "@/hooks/usePagination";
import { useToast } from "@/hooks/useToast";
import { getUniqueAnimes } from "@/lib/utils";

import { LoginScreen } from "@/components/admin/auth/LoginScreen";
import { Header } from "@/components/admin/layout/Header";
import { StatsBar } from "@/components/admin/layout/StatsBar";
import { QuoteFilters } from "@/components/admin/quotes/QuoteFilters";
import { QuoteTable } from "@/components/admin/quotes/QuoteTable";
import { QuoteForm } from "@/components/admin/quotes/QuoteForm";
import { ImportQuotesModal } from "@/components/admin/quotes/ImportQuotesModal";
import { Pagination } from "@/components/admin/quotes/Pagination";
import { ImagenesSection } from "@/components/admin/imagenes/ImagenesSection";
import { Modal } from "@/components/admin/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { ToastContainer } from "@/components/admin/ui/Toast";
import { Button } from "@/components/admin/ui/Button";
import { Plus, Database, AlertCircle, Upload } from "lucide-react";

type Tab = "quotes" | "imagenes";
type ModalMode = { type: "create" } | { type: "edit"; quote: Quote } | null;

export default function AdminPage() {
  const auth = useAuth();

  if (auth.status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-600/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (auth.status !== "authorized") {
    return <LoginScreen onSignIn={auth.signInWithGoogle} error={auth.error} />;
  }

  return (
    <AdminDashboard userEmail={auth.user?.email ?? null} onSignOut={auth.signOut} />
  );
}

function AdminDashboard({
  userEmail,
  onSignOut,
}: {
  userEmail: string | null;
  onSignOut: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("quotes");

  const { quotes, loading: quotesLoading, error: quotesError, create, update, remove } = useQuotes();
  const { imagenesMap, loading: imagenesLoading, error: imagenesError, addUrl, removeUrl, createAnime, deleteAnime } = useImagenes();

  const { filters, sort, filteredQuotes, setSearch, setAnime, toggleCategory, setSize, setSort, clearFilters, activeFilterCount } =
    useFilters(quotes);
  const { page, pageSize, total, totalPages, paginated, pageSizeOptions, setPage, setPageSize } =
    usePagination(filteredQuotes);
  const toast = useToast();

  const [modal, setModal] = useState<ModalMode>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Quote | null>(null);
  const [deleting, setDeleting] = useState(false);

  const animeOptions = getUniqueAnimes(quotes);
  const totalAnimes = Object.keys(imagenesMap).length;
  const connected = !quotesError && !quotesLoading && !imagenesError;

  async function handleQuoteSubmit(data: QuoteFormData) {
    if (modal?.type === "edit") {
      await update(modal.quote.id, data);
      toast.success("Quote actualizada correctamente.");
    } else {
      await create(data);
      toast.success("Quote creada correctamente.");
    }
    setModal(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success("Quote eliminada.");
      setDeleteTarget(null);
    } catch {
      toast.error("Error al eliminar la quote.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header
        totalQuotes={quotes.length}
        totalAnimes={totalAnimes}
        connected={connected}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userEmail={userEmail}
        onSignOut={onSignOut}
      />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

        {/* ── QUOTES TAB ── */}
        {activeTab === "quotes" && (
          <>
            {!quotesLoading && !quotesError && quotes.length > 0 && (
              <StatsBar quotes={quotes} />
            )}

            <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-4 px-5 py-4 border-b border-gray-800">
                <div>
                  <h2 className="text-base font-semibold text-gray-100">Quotes</h2>
                  {!quotesLoading && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {filteredQuotes.length} resultado{filteredQuotes.length !== 1 ? "s" : ""}
                      {activeFilterCount > 0 &&
                        ` · ${activeFilterCount} filtro${activeFilterCount !== 1 ? "s" : ""} activo${activeFilterCount !== 1 ? "s" : ""}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setImportOpen(true)}>
                    <Upload className="w-4 h-4" />
                    Importar JSON
                  </Button>
                  <Button onClick={() => setModal({ type: "create" })}>
                    <Plus className="w-4 h-4" />
                    Nueva quote
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="px-5 py-4 border-b border-gray-800 bg-gray-900/50">
                <QuoteFilters
                  filters={filters}
                  animeOptions={animeOptions}
                  activeFilterCount={activeFilterCount}
                  onSearchChange={setSearch}
                  onAnimeChange={setAnime}
                  onToggleCategory={toggleCategory}
                  onSizeChange={setSize}
                  onClear={clearFilters}
                />
              </div>

              {quotesLoading && <LoadingState message="Cargando quotes desde Firebase..." />}
              {!quotesLoading && quotesError && <ErrorState message={quotesError} />}
              {!quotesLoading && !quotesError && quotes.length === 0 && (
                <EmptyState onCreate={() => setModal({ type: "create" })} />
              )}
              {!quotesLoading && !quotesError && quotes.length > 0 && filteredQuotes.length === 0 && (
                <NoResultsState onClear={clearFilters} />
              )}
              {!quotesLoading && !quotesError && paginated.length > 0 && (
                <>
                  <QuoteTable
                    quotes={paginated}
                    sort={sort}
                    imagenesMap={imagenesMap}
                    onSort={setSort}
                    onEdit={(q) => setModal({ type: "edit", quote: q })}
                    onDelete={setDeleteTarget}
                  />
                  <div className="px-5 py-4 border-t border-gray-800">
                    <Pagination
                      page={page}
                      pageSize={pageSize}
                      total={total}
                      totalPages={totalPages}
                      pageSizeOptions={pageSizeOptions}
                      onPageChange={setPage}
                      onPageSizeChange={setPageSize}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ── IMAGENES TAB ── */}
        {activeTab === "imagenes" && (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
            <ImagenesSection
              imagenesMap={imagenesMap}
              loading={imagenesLoading}
              error={imagenesError}
              onAddUrl={addUrl}
              onRemoveUrl={removeUrl}
              onCreateAnime={createAnime}
              onDeleteAnime={deleteAnime}
              onToastSuccess={toast.success}
              onToastError={toast.error}
            />
          </div>
        )}
      </main>

      {/* Import JSON Modal */}
      <ImportQuotesModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={async (quotes) => {
          for (const q of quotes) {
            await create(q);
          }
          toast.success(`${quotes.length} quote${quotes.length !== 1 ? "s" : ""} importada${quotes.length !== 1 ? "s" : ""}.`);
        }}
      />

      {/* Create / Edit Quote Modal */}
      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.type === "edit" ? "Editar quote" : "Nueva quote"}
        size="lg"
      >
        {modal !== null && (
          <QuoteForm
            initialData={modal.type === "edit" ? modal.quote : undefined}
            imagenesMap={imagenesMap}
            onSubmit={async (data) => {
              try {
                await handleQuoteSubmit(data);
              } catch (err) {
                const message = err instanceof Error ? err.message : "Error inesperado.";
                toast.error(message);
                throw err;
              }
            }}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar quote"
        description={
          deleteTarget
            ? `¿Eliminar la quote de "${deleteTarget.author}" de "${deleteTarget.anime}"? Esta acción no se puede deshacer.`
            : ""
        }
        loading={deleting}
      />

      <ToastContainer toasts={toast.toasts} onRemove={toast.remove} />
    </div>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-600/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-red-400" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-300">Error de conexión</p>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">{message}</p>
      </div>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
        <Database className="w-8 h-8 text-gray-600" />
      </div>
      <div className="text-center">
        <p className="text-base font-medium text-gray-300">Sin quotes aún</p>
        <p className="text-sm text-gray-500 mt-1">Crea tu primera quote para empezar.</p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="w-4 h-4" />
        Crear primera quote
      </Button>
    </div>
  );
}

function NoResultsState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
        <span className="text-2xl">🔍</span>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-300">Sin resultados</p>
        <p className="text-xs text-gray-500 mt-1">Prueba ajustando los filtros.</p>
      </div>
      <Button variant="outline" size="sm" onClick={onClear}>
        Limpiar filtros
      </Button>
    </div>
  );
}
