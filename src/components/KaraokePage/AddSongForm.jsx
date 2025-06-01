function AddSongForm({ show, onClose, onSubmit, newItem, setNewItem }) {
    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="row mb-4">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Add New Song</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Song Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newItem.title}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Enter song title"
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Artist</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newItem.artist}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, artist: e.target.value }))}
                                        placeholder="Enter artist (optional)"
                                    />
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-success">Add Song</button>
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddSongForm;
