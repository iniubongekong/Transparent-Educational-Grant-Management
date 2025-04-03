;; Funder Registration Contract
;; Records details of grant-providing organizations

(define-data-var next-funder-id uint u1)

;; Define the funder data structure
(define-map funders uint {
  name: (string-ascii 100),
  description: (string-ascii 500),
  website: (string-ascii 100),
  contact-address: principal,
  active: bool,
  total-funds-committed: uint,
  registration-time: uint
})

;; Register a new funder
(define-public (register-funder
    (name (string-ascii 100))
    (description (string-ascii 500))
    (website (string-ascii 100))
    (funds-committed uint))
  (let ((funder-id (var-get next-funder-id)))
    (asserts! (> (len name) u0) (err u1)) ;; Name cannot be empty
    (asserts! (> funds-committed u0) (err u2)) ;; Must commit some funds

    (map-set funders funder-id {
      name: name,
      description: description,
      website: website,
      contact-address: tx-sender,
      active: true,
      total-funds-committed: funds-committed,
      registration-time: block-height
    })

    (var-set next-funder-id (+ funder-id u1))
    (ok funder-id)))

;; Get funder details
(define-read-only (get-funder (funder-id uint))
  (map-get? funders funder-id))

;; Update funder status
(define-public (update-funder-status (funder-id uint) (active bool))
  (let ((funder (unwrap! (map-get? funders funder-id) (err u404))))
    (asserts! (is-eq tx-sender (get contact-address funder)) (err u403))

    (map-set funders funder-id (merge funder { active: active }))
    (ok true)))

;; Update committed funds
(define-public (update-committed-funds (funder-id uint) (additional-funds uint))
  (let ((funder (unwrap! (map-get? funders funder-id) (err u404))))
    (asserts! (is-eq tx-sender (get contact-address funder)) (err u403))

    (map-set funders funder-id
      (merge funder {
        total-funds-committed: (+ (get total-funds-committed funder) additional-funds)
      })
    )
    (ok true)))
