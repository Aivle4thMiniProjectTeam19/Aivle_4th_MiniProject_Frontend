import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Stack, Typography, Paper } from "@mui/material";
import api from "../app/axios";

export default function BookEditPage() {
    const { id } = useParams(); // URL에서 bookId 가져오기
    const navigate = useNavigate();

    // 입력 폼 상태 관리 (BookUpdateForm과 필드명을 맞춰야 함)
    const [formData, setFormData] = useState({
        title: "",
        authorName: "",
        description: "",
        category: "",
        coverUrl: ""
    });

    const [loading, setLoading] = useState(true);

    // 1. 기존 책 정보 불러오기 (화면에 미리 보여주기 위함)
    useEffect(() => {
        async function fetchBook() {
            try {
                const res = await api.get(`/books/${id}`);
                const book = res.data.data;

                // 가져온 데이터를 폼 상태에 저장
                setFormData({
                    title: book.title || "",
                    authorName: book.authorName || "",
                    description: book.description || "",
                    category: book.category || "",
                    coverUrl: book.coverUrl || ""
                });
            } catch (e) {
                console.error(e);
                alert("책 정보를 불러오는데 실패했습니다.");
                navigate("/books"); // 실패 시 목록으로 이동
            } finally {
                setLoading(false);
            }
        }
        fetchBook();
    }, [id, navigate]);

    // 2. 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 3. 수정 요청 보내기 (PUT)
    const handleSubmit = async (e) => {
        e.preventDefault(); // 새로고침 방지

        // 유효성 검사 (예시)
        if (!formData.title || !formData.authorName) {
            alert("제목과 저자는 필수입니다.");
            return;
        }

        try {
            // 백엔드의 @PutMapping("/{bookId}") 호출
            // 두 번째 인자가 @RequestBody BookUpdateForm으로 들어감
            await api.put(`/books/${id}`, formData);

            alert("수정되었습니다!");
            navigate(`/books/${id}`); // 수정 후 상세 페이지로 이동
        } catch (e) {
            console.error(e);
            const msg = e.response?.data?.message || "수정에 실패했습니다.";
            alert(msg);
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    도서 정보 수정
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="제목"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="저자"
                            name="authorName"
                            value={formData.authorName}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="카테고리"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="설명"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            fullWidth
                        />
                        <TextField
                            label="표지 이미지 URL"
                            name="coverUrl"
                            value={formData.coverUrl}
                            onChange={handleChange}
                            fullWidth
                            placeholder="https://example.com/image.jpg"
                        />

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={() => navigate(-1)}>
                                취소
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                수정 완료
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}