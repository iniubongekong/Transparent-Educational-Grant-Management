;; Outcome Reporting Contract
;; Tracks results achieved with grant funding

(define-data-var next-report-id uint u1)

;; Define the report data structure
(define-map reports uint {
  grant-id: uint,
  title: (string-ascii 100),
  description: (string-ascii 1000),
  metrics: (string-ascii 500),
  submitted-by: principal,
  submission-time: uint,
  verified: bool,
  verification-time: uint
})

;; Submit a new outcome report
(define-public (submit-report
    (grant-id uint)
    (title (string-ascii 100))
    (description (string-ascii 1000))
    (metrics (string-ascii 500)))
  (let ((report-id (var-get next-report-id)))
    (asserts! (> (len title) u0) (err u1)) ;; Title cannot be empty

    ;; In a real implementation, you would verify the grant exists and is disbursed

    (map-set reports report-id {
      grant-id: grant-id,
      title: title,
      description: description,
      metrics: metrics,
      submitted-by: tx-sender,
      submission-time: block-height,
      verified: false,
      verification-time: u0
    })

    (var-set next-report-id (+ report-id u1))
    (ok report-id)))

;; Get report details
(define-read-only (get-report (report-id uint))
  (map-get? reports report-id))

;; Verify a report (would be called by the funder or a designated verifier)
(define-public (verify-report (report-id uint))
  (let ((report (unwrap! (map-get? reports report-id) (err u404))))
    ;; In a real implementation, you would verify the caller is authorized

    (map-set reports report-id
      (merge report {
        verified: true,
        verification-time: block-height
      })
    )
    (ok true)))

;; Get all reports for a specific grant
(define-read-only (get-reports-by-grant (grant-id uint))
  ;; In a real implementation, you would return all reports for a grant
  ;; This is a simplified version that doesn't actually implement this functionality
  ;; as Clarity doesn't support returning arrays directly
  (ok true))
