;; Fund Disbursement Contract
;; Manages payments for approved projects

(define-data-var next-grant-id uint u1)

;; Define the grant data structure
(define-map grants uint {
  applicant-id: uint,
  funder-id: uint,
  amount: uint,
  description: (string-ascii 500),
  status: (string-ascii 20), ;; "pending", "approved", "rejected", "disbursed"
  creation-time: uint,
  disbursement-time: uint
})

;; Create a new grant request
(define-public (create-grant
    (applicant-id uint)
    (funder-id uint)
    (amount uint)
    (description (string-ascii 500)))
  (let ((grant-id (var-get next-grant-id)))
    (asserts! (> amount u0) (err u1)) ;; Amount must be positive

    ;; In a real implementation, you would verify the applicant and funder exist
    ;; and check that the applicant is verified

    (map-set grants grant-id {
      applicant-id: applicant-id,
      funder-id: funder-id,
      amount: amount,
      description: description,
      status: "pending",
      creation-time: block-height,
      disbursement-time: u0
    })

    (var-set next-grant-id (+ grant-id u1))
    (ok grant-id)))

;; Get grant details
(define-read-only (get-grant (grant-id uint))
  (map-get? grants grant-id))

;; Approve a grant (would be called by the funder)
(define-public (approve-grant (grant-id uint))
  (let ((grant (unwrap! (map-get? grants grant-id) (err u404))))
    ;; In a real implementation, you would verify the caller is the funder

    (asserts! (is-eq (get status grant) "pending") (err u403))

    (map-set grants grant-id
      (merge grant { status: "approved" })
    )
    (ok true)))

;; Reject a grant (would be called by the funder)
(define-public (reject-grant (grant-id uint))
  (let ((grant (unwrap! (map-get? grants grant-id) (err u404))))
    ;; In a real implementation, you would verify the caller is the funder

    (asserts! (is-eq (get status grant) "pending") (err u403))

    (map-set grants grant-id
      (merge grant { status: "rejected" })
    )
    (ok true)))

;; Disburse funds for an approved grant
(define-public (disburse-funds (grant-id uint))
  (let ((grant (unwrap! (map-get? grants grant-id) (err u404))))
    ;; In a real implementation, you would verify the caller is authorized

    (asserts! (is-eq (get status grant) "approved") (err u403))

    ;; In a real implementation, you would transfer tokens here

    (map-set grants grant-id
      (merge grant {
        status: "disbursed",
        disbursement-time: block-height
      })
    )
    (ok true)))
